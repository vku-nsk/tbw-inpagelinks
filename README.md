# Inpagelinks plugin for [Trumbowyg HTML editor](https://alex-d.github.io/Trumbowyg//)
 The plugin creates button !(btn.png) on Trumbowyg panel. The button has dropdown menu with Create and Remove items.
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
Then you can use the new button definition ```inpageLabels```.
Be sure to include ```link``` button as well
```
$('#tbw-editor').trumbowyg({
  btns: [
    ["inpageLabels"],
    ["link"],
  ]
});  
```
