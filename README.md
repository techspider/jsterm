# jsterm

JSTerm is a powerful and lightweight terminal library for your webpage, all in pure JavaScript.

## Features

 * Zero external dependencies required.
 * Completely customizable terminal (font, colors, etc).
 * Authentic terminal experience with a blinking cursor, etc.
 * Easy implementation. All you need is a DIV container and 4 lines of code for the most basic example.
 * Automatically converts unknown objects to JSON when printing.
 * Can print advanced objects such as HTML elements.

## Basic Usage

```html
<div id="term_container"></div>
<script src="jsterm-min.js"></script>
<script>
var term = new Terminal('term_container', 800, 600);
term.termInit();
term.println("Hello!");
</script>
```

## Example (with input)

*Note: more examples can be found in the examples/ directory*
*If any examples do not work, please raise an issue immediately.*

```js
var term = new Terminal('term_container', 800, 600);
term.termInit();
term.print('Enter any text to repeat: ');
term.input((term, text)=>{ term.print('You said ' + text); });
```

## How to install

Just go to releases and select the latest release shown. Note that the release is a single, minified JavaScript file.

## Known bugs, issues, and missing features

All items marked {P} are planned for a future release.

### Missing Features

 * IDK yet

### Known Bugs/Issues

 * Character map is very buggy causing some keys to be misidentified.
 * Key listener listens on the entire document instead of the terminal container.


### Suggestions/Feedback

If you have any suggestions or want to leave feedback, please open an issue for it on GitHub.

### License

Licensed under the GNU GPL v3