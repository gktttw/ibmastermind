function generateUsermeta() {
    
    content = usermeta_data.allElo;
    html = '<table><thead><tr><th>User ID</th><th>T1 Elo</th><th>T2 Elo</th><th>T3 Elo</th><th>T4 Elo</th><th>T5 Elo</th><th>T6 Elo</th></tr></thead>';
    
    for (var i of usermeta_data.users) {
        html += '<tr><td>';
        html += i;
        html += '</td>';
        for (let j = 0; j < 6; j++) {
            html += '<td>';
            html += content[i][j];
            html += '</td>';
        }
        html += '</tr>';
    }
    html += '</table>';
        
    document.getElementById("metadata_content").innerHTML = html;
}