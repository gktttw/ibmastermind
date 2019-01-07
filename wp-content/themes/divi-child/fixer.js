function generateFixerPage() {
    
    content = fixer_data.content;
    html = '<form method="post" id="fixerform" action="/fixed"><input id="hiddenIdVariable" type="hidden" value="';
    html += content[0][0];
    html += '" name="firstId">';
    contentLength = content.length;
    for (i=0; i<contentLength; i++) {
        html += '<h1>';
        html += i+1;
        html += '</h1> - question child ID ';
        html += content[i][0];
        html += '<textarea name="question';
        html += content[i][0];
        html += '" form="fixerform" rows="12" cols="200">';
        html += content[i][1];
        html += '</textarea><textarea name="answer';
        html += content[i][0];
        html += '" form="fixerform" rows="40" cols="200">';
        html += content[i][2];
        html += '</textarea></br></br><hr>';
    }
    
    html += '<input type="submit" value="Submit"></form>'
    
    document.getElementById("fixer-content").innerHTML = html;
}