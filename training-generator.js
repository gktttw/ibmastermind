var questionId;
var topics = [];
var possibleMarks = [];
var questionFinished = 0;
var masterTimer = 0;

function createTimer() {

    masterTimerInterval = setInterval(function() { masterTimerFunction() }, 1000);

}

function masterTimerFunction() {

    masterTimer++;

}

function finishedQuestion() {

    // set question to finished:
    questionFinished = 1;

    //stop the timer:
    clearInterval(masterTimerInterval);
    
    //Hide the button:
    document.getElementById("finishedButton").style.display = "none";

    // Get all elements with class="answer" and show them
    answerContent = document.getElementsByClassName("ibmmanswer");
    for (i = 0; i < answerContent.length; i++) {
        answerContent[i].style.display = "block";
    }


}

function createQuestion() {
    
    let streak = training_data.streak;
    let streakName, streakURL, streakDescription, streakDaysRemaining;
    if (streak == 0) {
        streakName = 'Absolute Zero (0 kelvin)';
        streakURL = 'AbsoluteZero.png'
        streakDescription = 'The utter absence of energy. It is so cold that atoms have almost completed ceased to move at all, colder even than the furtherest depths of outer space.'
        streakDaysRemaining = 1;
    }
    else if (streak == 1) {
        streakName = 'Alive! (~310 kelvin)';
        streakURL = 'Alive.png'
        streakDescription = 'Good news - we have signs of life! With an average temperature of around 37 degrees Celsius, humans have a pretty mild temperature - but it\'s a huge step up from absolute zero.'
        streakDaysRemaining = 1;
    }
    else if (streak == 2) {
        streakName = 'Fried Egg (~328 kelvin)';
        streakURL = 'FriedEgg.png'
        streakDescription = 'At ~55 degrees Celsius, around the lowest possible temperature for frying eggs, it will take a while for the egg\'s proteins to unfold and become entangled together while it fries. It\'ll be worth it though!'
        streakDaysRemaining = 1;
    }
    else if (streak == 3) {
        streakName = 'Boiling (~373 kelvin)';
        streakURL = 'Boiling.png'
        streakDescription = 'Now we\'re heating up. As water approaches 100 degrees Celsius, it undergoes a rapid vaporisation - a state change from liquid to gas. The boiling point depends on the surrounding pressure. With lower pressure, less temperature is needed to cause the vaporisation.'
        streakDaysRemaining = 1;
    }
    else if (streak == 4) {
        streakName = 'Molten Gold (~1337 kelvin)';
        streakURL = 'MoltenGold.png'
        streakDescription = 'At ~1064 degrees Celsius, solid gold melts into a thick, glowing liquid which radiates heat.'
        streakDaysRemaining = 1;
    }
    else if (streak == 5) {
        streakName = 'Volcanic Eruption (up to ~1450 kelvin)';
        streakURL = 'VolcanicEruption.png'
        streakDescription = 'Fire! Fire!!'
        streakDaysRemaining = 1;
    }
    else if (streak == 6) {
        streakName = 'Combustion (~2200 kelvin, for coal)';
        streakURL = 'Combustion.png'
        streakDescription = 'Fire! Fire!!'
        streakDaysRemaining = 1;
    }
    else if (streak >= 7 && streak < 10) {
        streakName = 'Arc Discharge (~2800 kelvin)';
        streakURL = 'ArcDischarge.png'
        streakDescription = 'Fire! Fire!!'
        streakDaysRemaining = 10 - streak;
    }
    else if (streak == 10) {
        streakName = 'Rocket Launch (~2800 kelvin)';
        streakURL = 'ArcDischarge.png'
        streakDescription = 'Fire! Fire!!'
        streakDaysRemaining = 1;
    }
    

    
    var content = '';
    if (training_data.problem_report_submitted == 1) {
        content += '<b>Your report has been successfully submitted.</b> Thank you!</br></br>';
    }
    content += '</br><h1>Question ELO:';
    content += training_data.elo;
    content += '</br></h1>';
    content += '</br><h1>Diffuculty:';
    content += generateDifficulty(training_data.elo);
    content += '</br></h1>';
    content += training_data.shortcoded_question;
    content += '</br></br><div></br></br></br><button id="finishedButton" type="button" class="ibmmbutton ibmmquestion" onclick="finishedQuestion()">Finished!</button></div><div class=ibmmanswer><hr></br>';
    content += training_data.shortcoded_answer;
    content += '<form action="/oldone/training" method="POST" id="resultForm" onsubmit="return nextQuestion()"></br><p class = "ibmmanswer">Score: <input type="number" id="scoreToSubmit"></p></br><input id="newQuestionButton" type="submit" value="Next Question!" class="ibmmbutton ibmmanswer"><input id="hiddenScoreVariable" type="hidden" value="" name="questionScore"><input id="hiddenTimerVariable" type="hidden" value="" name="questionTime"><input id="hiddenIdVariable" type="hidden" value="" name="questionId"><input id="hiddenTopicsChangedVariable" type="hidden" value=false name="topicsChanged"><button id="getHelpButton" type="button" class="ibmmbutton" style="float:right" onclick="showNewTopic()">Ask a Question</button></br></br><input type="checkbox" id="topicbox1" name="changetopics[]" value=1><label for="topicbox1">Algebra</label><br><input type="checkbox" id="topicbox2" name="changetopics[]" value=2><label for="topicbox2">Functions and Equations</label><br><input type="checkbox" id="topicbox3" name="changetopics[]" value=3><label for="topicbox3">Circular Functions and Trigonometry</label><br><input type="checkbox" id="topicbox4" name="changetopics[]" value=4><label for="topicbox4">Vectors</label><br><input type="checkbox" id="topicbox5" name="changetopics[]" value=5><label for="topicbox5">Statistics and Probability</label><br><input type="checkbox" id="topicbox6" name="changetopics[]" value=6><label for="topicbox6">Calculus</label></br></form></br><div id="reportProblemButton"><button type="button"  onclick="showReportProblem()">Report a problem with this question/answer</button></div></div></br></br><div id="getHelpForm" class="ibmmtabcontent">';
    content += training_data.shortcoded_new_topic;
    content += '</div><div id="badgeDivWrapper" style="text-align: center"><div style="display: inline-block; width: 500px; padding-left:10px; padding-right:10px;" id="badgeDiv">Your current streak: <b>';
    content += training_data.streak;
    content += ' day';
    if (streak != 1) {
        content += 's';
    }
    content += '.</b></br></br><b>';
    content += streakName;
    content += '</b></br></br><img src="https://ibmastermind.com/images/badges/';
    content += streakURL;
    content += '" alt="';
    content += streakName;
    content += '" height="320" width = "320"></br></br>'
    content += streakDescription;
    content += '</br></br><b>';
    content += streakDaysRemaining;
    content += ' day</b>';
    if (streakDaysRemaining != 1) {
        content += 's';
    }
    content += ' until next badge. To continue your streak, complete at least one question each day. Each new day starts at midnight.</div>';
    
    document.getElementById("QuestionContent").innerHTML = content;
    
    // check selected topics:
    checkBoxes();
    
    // initialise timer:
    createTimer();
}

function checkBoxes() {
    
    // show boxes, and check the boxes which correspond to the user's selected topics:
    for (i=1; i <= 6; i++) {
        if (training_data.selected_topics[i] == "on") {
            document.getElementById("topicbox" + i).checked = true;
        }
    }
    
}

function showNewTopic() {
    
    document.getElementById("getHelpForm").style.display = "block";
    document.getElementById("getHelpButton").style.display = "none";
    document.getElementById("new-post").setAttribute("target", "blank");
}

function showReportProblem() {
    
    document.getElementById("reportProblemButton").innerHTML = '</br>Describe the issue below. You don\'t need to specify which question you are talking about. The report will be submitted when you click "Next Question".</br><textarea id="reportProblemTextarea" rows="20" cols="150" form="resultForm" name="reportedProblems"></textarea>';
}


function nextQuestion() {
    
    // check that scores has been filled out and is legal:
    questionScore = document.getElementById("scoreToSubmit").value;
    if (questionScore === null || questionScore === '') {
        alert("Please enter your score.");
        return false;
    }
    else if (questionScore > training_data.available_marks) {
        alert("It's not possible for your score to be that high!");
        return false;
    }
    
    //set topicChecked to false, unless at least one topic is checked:
    var topicChecked = false;
    
    // chek if user has changed their topics, and set variable accordingly:
    for (i=1; i<=6; i++) {
        if (document.getElementById("topicbox" + i).checked) {
            if (training_data.selected_topics[i] != "on") {
                document.getElementById("hiddenTopicsChangedVariable").value = true;
            }
            topicChecked = true;
        }
        else {
            if (training_data.selected_topics[i] == "on") {
                document.getElementById("hiddenTopicsChangedVariable").value = true;
            }
        }
    }
    
    if (topicChecked === false) {
        alert("Please select at least one topic.");
        return false;
    }
    
    document.getElementById('hiddenScoreVariable').value = questionScore;
    document.getElementById('hiddenTimerVariable').value = masterTimer;
    document.getElementById('hiddenIdVariable').value = training_data.question_id;
    
    // submit
}

/**
 * returns a string of html image tags of stars to represent difficulty
 * the default opponent elo is set to 1000
 * 
 * @param {*} elo the elo of the question
 */
function generateDifficulty(elo) {
    chanceToWin = 1 / (1 + (Math.pow(10, (1000 - elo)/400)));
    let rank = Math.floor(chanceToWin * 5) + 1;
    
    let stars = '';
    for(var i = 0; i < rank; i++) {
        stars += '<img src="http://localhost/oldone/wp-content/themes/divi-child/star_yellow.png">'
    }
    for(var i = 0; i < 5 - rank; i++) {
        stars += '<img src="http://localhost/oldone/wp-content/themes/divi-child/star_black.png">'
    }
    
    return stars;
}