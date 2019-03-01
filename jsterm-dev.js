/*
 * jsterm (C) mr_chainman (techspider) 2019.
 * Licensed under the GNU GPLv3.
 */

var _TGlobal = {
    createdTerms: 0,
    terminalOpts: [],
    kbdListen: false,
    kbdCb: null,
    lastPrintElem: null,
    inputString: "",
    kbdSecret: 0,
    kbdShiftHeld: false,
    kbdCtrlHeld: false
}

function locateCharFromMap(shiftHeld, event) {
    switch(event.keyCode)
    {
        case 32:
            return " ";
        default:
            return event.key[0].toString();
    }
}

var TerminalOptions = function()
{
    this.fontSize = '12px';
    this.cursorBlink = true;
    this.fontFamily = 'monospace';
    this.backColor = '#000000';
    this.foreColor = '#FFFFFF';
}

var PrintStyleOptions = function()
{
    this.backColor = 'inherit';
    this.foreColor = 'inherit';
}

var Terminal = function(containerId, width, height, opts)
{
    this.container = typeof(containerId) == "string" ? document.getElementById(containerId) : containerId; //If an element is already specified, ignore it
    this.termId = `term_${_TGlobal.createdTerms}`;
    this.textContainerId = `${this.termId}_textContainer`;
    var options = (opts != null) ? opts : new TerminalOptions();
    this.textContainer = null;
    this.backColor = options.backColor;
    this.foreColor = options.foreColor;
    this.cursorBlink = options.cursorBlink;
    this.fontSize = options.fontSize;
    this.fontFamily = options.fontFamily;
    this.width = width;
    this.height = height;
    this.cursor = null;

    this.termInit = function()
    {
        this.textContainer = document.createElement('div');
        this.textContainer.style.backgroundColor = this.backColor;
        this.textContainer.style.color = this.foreColor;
        this.textContainer.style.fontSize = this.fontSize;
        this.textContainer.style.fontFamily = this.fontFamily;
        this.textContainer.style.fontWeight = 900;
        this.textContainer.style.overflowX = 'hidden';
        if(typeof(this.width) == 'number') this.textContainer.style.maxWidth = `${this.width}px`;
        else this.textContainer.style.maxWidth = this.width;

        this.container.style.backgroundColor = this.backColor;
        if(typeof(this.width) == 'number') this.container.style.width = `${this.width}px`;
        else this.container.style.width = this.width;
        if(typeof(this.height) == 'number') this.container.style.height = `${this.height}px`;
        else this.container.style.height = this.height;
        this.container.style.overflowY = 'scroll';

        this.cursor = document.createElement('span');
        this.cursor.innerHTML = '&nbsp;';
        this.cursor.style.backgroundColor = '#FFFFFF';
        this.cursor.setAttribute("id", `${this.termId}_cursor`);
        this.cursor.style.display = 'inline';

        this.textContainer.appendChild(this.cursor);
        this.container.appendChild(this.textContainer);

        if(this.cursorBlink)
        {
            setInterval(()=>{
                if(this.cursor.style.display != 'none') this.cursor.style.display = 'none';
                else this.cursor.style.display = 'inline';
            }, 500);
        }
    }

    this.clear = function()
    {
        this.textContainer.innerHTML = "";
        this.textContainer.appendChild(this.cursor);
    }

    this.print = function(text, chrattr, opts)
    {
        this.textContainer.removeChild(this.cursor);
        var textElement = document.createElement('span');
        if((typeof(text) != 'string'))
        {
            try
            {
                textElement.innerText = JSON.stringify(text, null, 4);
            }
            catch(e)
            {
                textElement.innerText = text.toString();
            }
        }
        else textElement.innerText = text;
        textElement.style.whiteSpace = 'pre-line';
        textElement.style.display = 'inline';
        if(opts != null)
        {
            if(opts.foreColor != 'inherit') textElement.style.color = opts.foreColor;
            if(opts.backColor != 'inherit') textElement.style.color = opts.backColor;
            textElement.style.fontWeight = 900;
        }
        if(chrattr)
        {
            textElement.setAttribute(`is_kbd_char${_TGlobal.kbdSecret}`, "true");
            if(text == ' ') textElement.innerHTML = "&nbsp";
        }
        _TGlobal.lastPrintElem = textElement;
        this.textContainer.appendChild(textElement);
        this.textContainer.appendChild(this.cursor);
        this.scrollUpdate();
    }

    this.printHtml = function(htmlCode)
    {
        this.textContainer.removeChild(this.cursor);
        var htmlElem = document.createElement('span');
        htmlElem.innerHTML = htmlCode;
        htmlElem.style.display = 'inline';
        htmlElem.innerHTML += "<br>";
        this.textContainer.appendChild(htmlElem);
        this.textContainer.appendChild(this.cursor);
        this.scrollUpdate();
    }

    this._keyboardListenerUp = function(event)
    {
        switch(event.keyCode)
        {
            case 16:
                _TGlobal.kbdShiftHeld = false;
                break;
            case 17:
                _TGlobal.kbdCtrlHeld = false;
                break;
        }
    }

    this._keyboardListener = function(event)
    {//TODO set kbdlisten to false once done listening
        _TGlobal.kbdListen = true;
        switch(event.keyCode)
        {
            default:
                var chr = locateCharFromMap(_TGlobal.kbdShiftHeld, event);
                _TGlobal.inputString += chr;
                _TGlobal.t.print(chr, true);
                break;
            case 16: //SHIFT
                _TGlobal.kbdShiftHeld = true;
                break;
            case 17: //CTRL
                _TGlobal.kbdCtrlHeld = true;
                break;
            case 32: //SPACE
                _TGlobal.inputString += ' ';
                _TGlobal.t.print(' ', true);
                break;
            case 20: //CAPS LOCK
                break;
            case 13: //RETURN, END THE LISTENING
                _TGlobal.t.print('\n', true);
                _TGlobal.kbdListen = false;
                document.removeEventListener('keydown', _TGlobal.t._keyboardListener, true);
                document.removeEventListener('keyup', _TGlobal.t._keyboardListenerUp, true);
                _TGlobal.kbdCb(_TGlobal.t, _TGlobal.inputString);
                break;
            case 8: //BKSP
                if(!_TGlobal.t.textContainer.children.length > 2) return;
                var lastCharEl = _TGlobal.t.textContainer.children[term.textContainer.children.length-2];
                if((lastCharEl.getAttribute(`is_kbd_char${_TGlobal.kbdSecret}`) == null) || (lastCharEl.getAttribute(`is_kbd_char${_TGlobal.kbdSecret}`) != "true")) return; //probably not a keyboard character
                _TGlobal.t.textContainer.removeChild(lastCharEl);
                _TGlobal.inputString = _TGlobal.inputString.substring(0, _TGlobal.inputString.length - 1);
                break;
        }
    }

    this.input = function(cb)
    {
        if(_TGlobal.kbdListen) return;
        _TGlobal.inputString = "";
        _TGlobal.kbdCb = cb;
        _TGlobal.t = this; //hook print function
        _TGlobal.kbdSecret = Math.round(Math.random() * 1000);
        document.addEventListener('keydown', this._keyboardListener, true);
        document.addEventListener('keyup', this._keyboardListenerUp, true);
    }

    this.println = function(text)
    {
        this.print(`${text}\n`);
    }

    this.scrollUpdate = function()
    {
        this.container.scrollTop = this.container.scrollHeight;
    }
}