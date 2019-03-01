var term = new Terminal('term', '100%', '100%');
term.termInit();
term.println("JavaScript shell version 1.0.\n");

//hook console functions
console.log = (text)=> term.print(text);
var pe;
console.error = (pe = (err)=>{
    term.print(err + "\n", false, {
        foreColor: 'red',
        backColor: 'inherit'
    });
});

function shellProc()
{
    term.print("> ");
    term.input((term, text)=>{
        try
        {
            var result = eval(text);
            switch(typeof(result))
            {
                default:
                    term.println(result);
                    break;
                case 'undefined':
                    term.print(result + "\n", false, {
                        foreColor: 'gray'
                    });
                    break;
                case 'function':
                    term.print(result + "\n", false, {
                        foreColor: 'green'
                    });
                    break;
                case 'object':
                    term.print(result + "\n", false, {
                        foreColor: 'cyan'
                    });
                    break;
                case 'number':
                    term.print(result + "\n", false, {
                        foreColor: 'yellow'
                    });
                    break;
                case 'string':
                    term.print("\"" + result + "\"" + "\n", false, {
                        foreColor: "orange"
                    });
                    break;
                case 'boolean':
                    term.print(result + "\n", false, {
                        foreColor: "magenta"
                    });
                    break;
            }
        }
        catch(e)
        {
            pe(e.toString() + "\n");
        }
        shellProc();
    });
}

shellProc();