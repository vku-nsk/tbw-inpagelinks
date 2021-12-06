# Inpagelinks plugin for [Trumbowyg HTML editor](https://alex-d.github.io/Trumbowyg//)
## [Live demo](https://vku-nsk.github.io/tbw-inpagelinks//)
## Usage
```
<-- Import Trumbowyg Inpagelinks style in <head>... -->
<link rel="stylesheet" href="inpagelinks/trumbowyg.inpagelinks.min.css">
```
```
<-- Import Inpagelinks plugin... -->
<script src="inpagelinks/trumbowyg.inpagelinks.min.js"></script>
```
Then you can use the new button definition ```inpageLabels```
Be sure to include ```link``` button as well
```
$('#tbw-editor').trumbowyg({
  lang: navigator.language.split('-', 1)[0],
  btns: [
    ["inpageLabels"],
    ["link"],
  ]
```
