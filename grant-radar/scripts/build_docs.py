from pathlib import Path
from html import escape
import re
from docx import Document
from docx.shared import Inches, Pt, RGBColor
from docx.enum.text import WD_ALIGN_PARAGRAPH
from docx.enum.section import WD_SECTION
from docx.enum.table import WD_TABLE_ALIGNMENT, WD_CELL_VERTICAL_ALIGNMENT
from docx.oxml import OxmlElement
from docx.oxml.ns import qn

ROOT=Path(__file__).resolve().parents[1]
DIST=ROOT/'dist'

def inline_html(s):
    s=escape(s)
    s=re.sub(r'`([^`]+)`',r'<code>\1</code>',s)
    s=re.sub(r'\*\*([^*]+)\*\*',r'<strong>\1</strong>',s)
    return s

def md_html(text,title):
    out=[]; in_ul=False; in_ol=False; in_code=False
    for raw in text.splitlines():
        line=raw.rstrip()
        if line.startswith('```'):
            if in_code: out.append('</code></pre>'); in_code=False
            else: out.append('<pre><code>'); in_code=True
            continue
        if in_code: out.append(escape(line)+'\n'); continue
        if line.startswith('- '):
            if not in_ul: out.append('<ul>'); in_ul=True
            out.append('<li>'+inline_html(line[2:])+'</li>'); continue
        if re.match(r'^\d+\. ',line):
            if not in_ol: out.append('<ol>'); in_ol=True
            out.append('<li>'+inline_html(re.sub(r'^\d+\. ','',line))+'</li>'); continue
        if in_ul: out.append('</ul>'); in_ul=False
        if in_ol: out.append('</ol>'); in_ol=False
        if not line: continue
        m=re.match(r'^(#{1,3})\s+(.*)$',line)
        if m:
            level=len(m.group(1)); ident=re.sub(r'[^a-z0-9]+','-',m.group(2).lower()).strip('-')
            out.append(f'<h{level} id="{ident}">{inline_html(m.group(2))}</h{level}>')
        elif line.startswith('|'):
            # Tables are intentionally rendered as preformatted text in HTML source docs.
            out.append('<p>'+inline_html(line)+'</p>')
        else: out.append('<p>'+inline_html(line)+'</p>')
    if in_ul: out.append('</ul>')
    if in_ol: out.append('</ol>')
    body='\n'.join(out)
    return f'''<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>{escape(title)}</title><style>body{{max-width:860px;margin:0 auto;padding:36px 22px 80px;font:16px/1.65 Arial;color:#18313a}}h1{{font-size:2.2rem}}h2{{margin-top:2.2rem;border-top:1px solid #d8e1e4;padding-top:1rem}}h3{{margin-top:1.5rem}}a{{color:#126b76}}code,pre{{background:#edf2f3;padding:.15rem .3rem}}pre{{overflow:auto;padding:1rem}}li{{margin:.3rem 0}}.back{{position:sticky;top:0;background:white;padding:.7rem 0}}@media(max-width:600px){{body{{padding:22px 16px 60px}}h1{{font-size:1.8rem}}}}</style></head><body><div class="back"><a href="/">← Back to Grant Radar</a></div>{body}</body></html>'''

def set_repeat_header(row):
    trPr=row._tr.get_or_add_trPr(); tag=OxmlElement('w:tblHeader'); tag.set(qn('w:val'),'true'); trPr.append(tag)

def shade(cell,fill):
    tcPr=cell._tc.get_or_add_tcPr(); shd=OxmlElement('w:shd'); shd.set(qn('w:fill'),fill); tcPr.append(shd)

def set_cell_margins(cell,top=100,start=100,bottom=100,end=100):
    tc=cell._tc; tcPr=tc.get_or_add_tcPr(); tcMar=tcPr.first_child_found_in('w:tcMar')
    if tcMar is None: tcMar=OxmlElement('w:tcMar'); tcPr.append(tcMar)
    for m,v in [('top',top),('start',start),('bottom',bottom),('end',end)]:
        node=tcMar.find(qn('w:'+m))
        if node is None: node=OxmlElement('w:'+m); tcMar.append(node)
        node.set(qn('w:w'),str(v)); node.set(qn('w:type'),'dxa')

def configure(doc,title):
    sec=doc.sections[0]; sec.page_width=Inches(8.5); sec.page_height=Inches(11); sec.top_margin=Inches(.7); sec.bottom_margin=Inches(.7); sec.left_margin=Inches(.8); sec.right_margin=Inches(.8)
    styles=doc.styles
    styles['Normal'].font.name='Arial'; styles['Normal'].font.size=Pt(10.5); styles['Normal'].font.color.rgb=RGBColor(0,0,0); styles['Normal'].paragraph_format.space_after=Pt(6); styles['Normal'].paragraph_format.line_spacing=1.08
    for name,size in [('Title',27),('Heading 1',18),('Heading 2',14),('Heading 3',11.5)]:
        st=styles[name]; st.font.name='Arial'; st.font.size=Pt(size); st.font.bold=True; st.font.color.rgb=RGBColor(0,0,0); st.paragraph_format.keep_with_next=True; st.paragraph_format.space_before=Pt(11); st.paragraph_format.space_after=Pt(5)
    # Remove Word's theme border from the Title style and give list items visible separation.
    title_ppr=styles['Title']._element.get_or_add_pPr()
    border=title_ppr.find(qn('w:pBdr'))
    if border is not None: title_ppr.remove(border)
    for name in ['List Bullet','List Number']:
        styles[name].font.name='Arial'; styles[name].font.size=Pt(10.5)
        styles[name].paragraph_format.space_after=Pt(2); styles[name].paragraph_format.line_spacing=1.08
    p=doc.add_paragraph(style='Title'); p.add_run(title)

def add_inline(par,text):
    parts=re.split(r'(\*\*[^*]+\*\*|`[^`]+`)',text)
    for part in parts:
        if part.startswith('**') and part.endswith('**'): par.add_run(part[2:-2]).bold=True
        elif part.startswith('`') and part.endswith('`'): r=par.add_run(part[1:-1]); r.font.name='Courier New'; r.font.size=Pt(9)
        else: par.add_run(part)

def md_docx(text,out,title):
    doc=Document(); configure(doc,title)
    lines=text.splitlines()[1:]; i=0; ordered_index=0
    while i<len(lines):
        line=lines[i].rstrip()
        if not line: i+=1; continue
        if line.startswith('|') and i+1<len(lines) and re.match(r'^\|[-:| ]+\|$',lines[i+1]):
            rows=[]; i+=2
            header=[x.strip() for x in line.strip('|').split('|')]
            while i<len(lines) and lines[i].startswith('|'):
                rows.append([x.strip() for x in lines[i].strip('|').split('|')]); i+=1
            table=doc.add_table(rows=1,cols=len(header)); table.alignment=WD_TABLE_ALIGNMENT.CENTER; table.autofit=True
            set_repeat_header(table.rows[0])
            for j,val in enumerate(header):
                cell=table.rows[0].cells[j]; shade(cell,'173F4B'); cell.vertical_alignment=WD_CELL_VERTICAL_ALIGNMENT.CENTER; set_cell_margins(cell)
                r=cell.paragraphs[0].add_run(val); r.bold=True; r.font.color.rgb=RGBColor(255,255,255); r.font.size=Pt(9)
            for ridx,row in enumerate(rows):
                cells=table.add_row().cells
                for j,val in enumerate(row):
                    set_cell_margins(cells[j]); cells[j].vertical_alignment=WD_CELL_VERTICAL_ALIGNMENT.CENTER
                    if ridx%2: shade(cells[j],'EEF4F5')
                    p=cells[j].paragraphs[0]; add_inline(p,val)
                    for r in p.runs:r.font.size=Pt(8.5)
            continue
        if line.startswith('```'):
            code=[]; i+=1
            while i<len(lines) and not lines[i].startswith('```'): code.append(lines[i]); i+=1
            p=doc.add_paragraph(); r=p.add_run('\n'.join(code)); r.font.name='Courier New'; r.font.size=Pt(8); i+=1; continue
        m=re.match(r'^(#{2,4})\s+(.*)$',line)
        if m:
            level=min(3,len(m.group(1))-1); doc.add_paragraph(m.group(2),style=f'Heading {level}'); i+=1; continue
        if line.startswith('- '):
            p=doc.add_paragraph(); p.paragraph_format.left_indent=Inches(.28); p.paragraph_format.first_line_indent=Inches(-.2); add_inline(p,'•  '+line[2:]); p.add_run().add_break(); ordered_index=0; i+=1; continue
        if re.match(r'^\d+\. ',line):
            ordered_index+=1; p=doc.add_paragraph(); p.paragraph_format.left_indent=Inches(.32); p.paragraph_format.first_line_indent=Inches(-.28); add_inline(p,f'{ordered_index}.  '+re.sub(r'^\d+\. ','',line)); p.add_run().add_break(); i+=1; continue
        ordered_index=0; p=doc.add_paragraph(); add_inline(p,line); i+=1
    footer=doc.sections[0].footer.paragraphs[0]; footer.alignment=WD_ALIGN_PARAGRAPH.CENTER; footer.add_run('Nami Grant Radar · '+REV if False else 'Nami Grant Radar · 2026-09-12 · Version 1.0.1')
    for r in footer.runs:r.font.size=Pt(8);r.font.color.rgb=RGBColor(90,105,110)
    doc.core_properties.title=title; doc.core_properties.subject='Nami Grant Radar evaluation prototype documentation'; doc.core_properties.author='Nami Dashboard Suite'; doc.save(out)

def main():
    DIST.mkdir(exist_ok=True)
    manual=(ROOT/'USER_MANUAL.md').read_text(); quick=(ROOT/'QUICKSTART.md').read_text()
    (DIST/'manual.html').write_text(md_html(manual,'Nami Grant Radar User Manual'))
    (DIST/'quickstart.html').write_text(md_html(quick,'Nami Grant Radar Quick Start'))
    md_docx(manual,DIST/'Nami_Grant_Radar_User_Manual.docx','Nami Grant Radar User Manual')
    md_docx(quick,DIST/'Nami_Grant_Radar_Quick_Start.docx','Nami Grant Radar Quick Start')

if __name__=='__main__': main()
