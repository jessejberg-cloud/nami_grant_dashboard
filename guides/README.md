# Guides for the whole suite

Two files that gather the three programs' guides under one title, each starting with a page on how the programs fit together and what they have in common:

- `dist/NAMI_Dashboard_Suite_Quick_Start_Guides` (.pdf, .docx, .html, .md): the three quick starts
- `dist/NAMI_Dashboard_Suite_User_Manuals` (.pdf, .docx, .html, .md): the three manuals

They are **built, not written**: `python3 guides/build.py` reads each program's own `QUICKSTART.md` and `USER_MANUAL.md` (the single sources) plus `overview.md`, then `node guides/print_pdfs.mjs` prints the PDFs. Run both after changing any program's guide. `EMAILS.md` holds the overview email and the three program emails.

**The handbook** (`dist/NAMI_Dashboard_Suite_Handbook.pdf` and `.docx`) gathers everything for the binder, leadership first: the overview and the one-page plan, the implementation chapter (`implementation.md`), the quick starts, the manuals, and the emails. Build order after any change:

```
node guides/map_png.mjs && python3 guides/build.py && python3 guides/handbook.py && node guides/print_pdfs.mjs && node scripts/build-site.mjs
```

`PREFLIGHT.md` is Jesse's list of steps before the first email goes out.
