# Guides for the whole suite

Two files that gather the three programs' guides under one title, each starting with a page on how the programs fit together and what they have in common:

- `dist/NAMI_Dashboard_Suite_Quick_Start_Guides` (.pdf, .docx, .html, .md): the three quick starts
- `dist/NAMI_Dashboard_Suite_User_Manuals` (.pdf, .docx, .html, .md): the three manuals

They are **built, not written**: `python3 guides/build.py` reads each program's own `QUICKSTART.md` and `USER_MANUAL.md` (the single sources) plus `overview.md`, then `node guides/print_pdfs.mjs` prints the PDFs. Run both after changing any program's guide. `EMAILS.md` holds the overview email and the three program emails.
