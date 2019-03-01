var term = new Terminal('term', '100%', '100%');
term.termInit();
term.println("JavaScript shell version 1.0.\n");

function shellProc()
{
    term.print("> ");
    term.input((term, text)=>{
        try
        {
            var result = eval(text);
            term.println(result);
        }
        catch(e)
        {
            term.println(e);
        }
        shellProc();
    });
}

shellProc();