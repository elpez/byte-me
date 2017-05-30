var my_textarea = document.getElementById("sourceCodeTextarea");
var editor = CodeMirror.fromTextArea(my_textarea, {lineNumbers: true, mode:"python", smartIndent: true});

$("#compile").click(function() {
    $.ajax({
        url: "/bytecode",
        data: {sourceCode: editor.getValue()},
        dataType: "json", 
        method: "POST",
        success: function(data){
	    addBytecode(data);
	    register_tooltips();    
	}
    });
});

function addBytecode(data) {
    if (typeof data !== "string") {
        if (data.length > 0) {
            // clear the error box
            $("#syntaxError").text("");
            // remove all previous bytecode elements
            $(".bytecode-row").detach();
	    //create row, col, table
	    var row = document.createElement("div");
	    row.setAttribute("class", "row bytecode-row justify-content-center");
	    var col = document.createElement("div");
	    col.setAttribute("class", "col-md-6");
	    var table = document.createElement("table");
	    table.id="bytecode-table";
	    table.setAttribute("class", "table table-hover");
	    col.appendChild(table);
	    row.appendChild(col);
	    $("#mainContainer").append(row);
	    document.getElementById("bytecode-table").innerHTML='<thead><tr><th>Bytecode</th><th>Opname</th><th>Argument Index</th><th>Argument</th></tr></thead>';
	    var body = document.createElement("tbody");
	    body.id = "tableBody";
	    table.append(body);
            for (var i = 0; i < data.length; i++) {
                createBytecodeRow(data[i]);
            }
        }
    } else {
        $("#syntaxError").text(data);
    }
}

function createBytecodeRow(codeObj) {
    // I hope there's a better way to do this
    // table.appendChild(content);
    var tablerow =  document.createElement("tr");
    var source = document.createElement("td");
    var opname = document.createElement("td");
    var arg = document.createElement("td");
    var argrepr = document.createElement("td");
    source.setAttribute("scope", "row");
    source.innerHTML = codeObj.source;
    opname.innerHTML = codeObj.bytecode[0].opname;
    opname.setAttribute("class", codeObj.bytecode[0].opname);
    arg.innerHTML = codeObj.bytecode[0].arg;
    argrepr.innerHTML = codeObj.bytecode[0].arg;
    tablerow.append(source);
    tablerow.append(opname);
    tablerow.append(arg);
    tablerow.append(argrepr);
    $("#tableBody").append(tablerow);
    for (var i = 1; i <codeObj.bytecode.length; i++) {
	var extraTablerow = document.createElement("tr");
	var extraOpname = document.createElement("td");
	var extraArg = document.createElement("td");
	var extraArgrepr = document.createElement("td");
	extraOpname.setAttribute("class", codeObj.bytecode[i].opname);
	extraOpname.innerHTML = codeObj.bytecode[i].opname;
	extraArg.innerHTML = codeObj.bytecode[i].arg;
	extraArgrepr.innerHTML = codeObj.bytecode[i].arg;
	extraTablerow.append(document.createElement("td"));
	extraTablerow.append(extraOpname);
	extraTablerow.append(extraArg);
	extraTablerow.append(extraArgrepr);
	$("#tableBody").append(extraTablerow);

	$("#tableBody").append(extraTablerow);
    }
    return tablerow;
}
