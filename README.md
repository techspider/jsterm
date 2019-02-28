# jsterm

JSTerm is a powerful and lightweight terminal library for your webpage, all in pure JavaScript.

## Features

 * Completely customizable terminal (font, colors, etc).
 * Authentic terminal experience with a blinking cursor, etc.
 * Easy implementation. All you need is a DIV container and 4 lines of code for the most basic example.

## Example (no input)

*Note: more examples can be found in the examples/ directory*
*If any examples do not work, please raise an issue immediately.*

```js
var term = new Terminal('term_container', 800, 600);
term.termInit();
term.println('Hello world!');
```

## Example (with input)

```js
var term = new Terminal('term_container', 800, 600);
term.termInit();
term.print('Enter any text to repeat: ');
term.input((term, text)=>{ term.print('You said ' + text); });
```

## How to install

Just go to releases and select the latest release shown.

## Known bugs, issues, and missing features

All items marked {P} are planned for a future release.

### Missing Features

 * No clear screen support {P}
 * No color support {P}

### Known Bugs/Issues

 * Character map is very buggy causing some keys to be misidentified.
 * Key listener listens on the entire document instead of the terminal container.


### Suggestions/Feedback

If you have any suggestions or want to leave feedback, please open an issue for it on GitHub.