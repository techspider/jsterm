var _TGlobal = {
    createdTerms: 0,
    terminalOpts: []
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

    this.print = function(text)
    {
        this.textContainer.removeChild(this.cursor);
        var textElement = document.createElement('span');
        textElement.innerText = text;
        textElement.style.whiteSpace = 'pre-line';
        textElement.style.display = 'inline';
        this.textContainer.appendChild(textElement);
        this.textContainer.appendChild(this.cursor);
        this.scrollUpdate();
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