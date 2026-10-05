# Command line

qpdf can extract one or more specific pages from a PDF into a new PDF.

If you have qpdf installed:

```ps
qpdf input.pdf --pages input.pdf 3-5 -- extracted.pdf
```

That extracts pages 3 through 5.

For individual pages 3 and 5:

```ps
qpdf input.pdf --pages input.pdf 3,5 -- extracted.pdf

# example
qpdf "Advanced-Exercises-By-Douglas Tate-Cheng Jang Ming.pdf" --pages  "Advanced-Exercises-By-Douglas Tate-Cheng Jang Ming.pdf" 7,9,11,13,15,17,19,21,23,25,27,29,31,33,35,37  -- extracted.pdf
```
