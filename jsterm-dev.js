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

function locateCharFromMap(isShiftKey, characterCode) {
    if ( characterCode === 27 || characterCode === 8 || characterCode === 9 || characterCode === 20 || characterCode === 16 || characterCode === 17 || characterCode === 91 || characterCode === 13 || characterCode === 92 || characterCode === 18 ) {
        return false;
    }
    if (typeof isShiftKey != "boolean" || typeof characterCode != "number") {
        return false;
    }
    var characterMap = [];
    characterMap[192] = "~";
    characterMap[49] = "!";
    characterMap[50] = "@";
    characterMap[51] = "#";
    characterMap[52] = "$";
    characterMap[53] = "%";
    characterMap[54] = "^";
    characterMap[55] = "&";
    characterMap[56] = "*";
    characterMap[57] = "(";
    characterMap[48] = ")";
    characterMap[109] = "_";
    characterMap[107] = "+";
    characterMap[219] = "{";
    characterMap[221] = "}";
    characterMap[220] = "|";
    characterMap[59] = ":";
    characterMap[222] = "\"";
    characterMap[188] = "<";
    characterMap[190] = ">";
    characterMap[191] = "?";
    characterMap[32] = " ";
    var character = "";
    if (isShiftKey)
    {
        if ( characterCode >= 65 && characterCode <= 90 )
        {
            character = String.fromCharCode(characterCode);
        } 
        else 
        {
            character = characterMap[characterCode];
        }
    } 
    else 
    {
        if ( characterCode >= 65 && characterCode <= 90 ) 
        {
            character = String.fromCharCode(characterCode).toLowerCase();
        } 
        else
        {
            character = String.fromCharCode(characterCode);
        }
    }
    return character;
}

var Terminal = function(containerId, width, height)
{
    this.container = typeof(containerId) == "string" ? document.getElementById(containerId) : containerId; //If an element is already specified, ignore it
    this.termId = `term_${_TGlobal.createdTerms}`;
    this.textContainerId = `${this.termId}_textContainer`;
    this.textContainer = null;
    this.backColor = "#000000";
    this.foreColor = "#FFFFFF";
    this.cursorBlink = false;
    this.fontSize = '12px';
    this.fontFamily = 'Courier New';
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
        this.textContainer.style.maxWidth = `${this.width}px`;

        this.container.style.backgroundColor = this.backColor;
        this.container.style.height = `${this.height}px`;
        this.container.style.width = `${this.width}px`;
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

    this.print = function(text, chrattr)
    {
        this.textContainer.removeChild(this.cursor);
        var textElement = document.createElement('span');
        textElement.innerText = text;
        textElement.style.whiteSpace = 'pre-line';
        textElement.style.display = 'inline';
        if(chrattr) textElement.setAttribute(`is_kbd_char${_TGlobal.kbdSecret}`, "true");
        _TGlobal.lastPrintElem = textElement;
        this.textContainer.appendChild(textElement);
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
                var chr = locateCharFromMap(_TGlobal.kbdShiftHeld, event.keyCode);
                _TGlobal.inputString += chr;
                _TGlobal.t.print(chr, true);
                break;
            case 16: //SHIFT
                _TGlobal.kbdShiftHeld = true;
                break;
            case 17: //CTRL
                _TGlobal.kbdCtrlHeld = true;
                break;
            case 13: //RETURN, END THE LISTENING
                _TGlobal.t.print('\n', true);
                _TGlobal.kbdListen = false;
                document.removeEventListener('keydown', _TGlobal.t._keyboardListener, true);
                document.removeEventListener('keyup', _TGlobal.t._keyboardListenerUp, true);
                _TGlobal.kbdCb(_TGlobal.inputString);
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