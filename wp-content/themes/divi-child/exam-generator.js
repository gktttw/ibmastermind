var timers = [];
var scores = [];
var questionIds = [];
var topics = [];
var possibleMarks = [];
var examFinished = 0;
var currentTimer;
var masterTimer = 0;
var masterTimerSeconds = 0;
var masterTimerMinutes = exam_data.time;
var masterTimerSecondsFormatted = 0;
var masterTimerSwitch = 0;
var timerMinutes
var timerSeconds

function createTimers(questionNumber) {

    for (var i = 0; i < questionNumber; ++i) {
      timers[i] = 0;
    }
    
}

function openQuestion(event, questionNumber) {
    // Declare all variables
    var i, tabContent, tabLinks;
    
    // activate master timer (one time only):
    if (masterTimerSwitch === 0) {
        if (exam_data.timer_settings == "off") {
            masterTimerInterval = setInterval(function() { masterTimerFunctionOff() }, 1000);
        }
        else {
        masterTimerInterval = setInterval(function() { masterTimerFunctionOn() }, 1000);
        }
        masterTimerSwitch = 1;
    }

    // Check if clicked tab was already active:
    if (event.currentTarget.classList.contains("active")) {
        console.log('question already selected');
    }

    else {

        // Get all elements with class="ibmmtabcontent" and hide them
        tabContent = document.getElementsByClassName("ibmmtabcontent");
        for (i = 0; i < tabContent.length; i++) {
            tabContent[i].style.display = "none";
        }

        // Get all elements with class="ibmmtablinks" and remove the class "active"
        tabLinks = document.getElementsByClassName("ibmmtablinks");
        for (i = 0; i < tabLinks.length; i++) {
            tabLinks[i].className = tabLinks[i].className.replace(" active", "");
        }
        
        // Get all elements with class="ibmmhelpform" and hide them
        helpFormsToHide = document.getElementsByClassName("ibmmhelpform");
        for (i = 0; i < helpFormsToHide.length; i++) {
            helpFormsToHide[i].style.display = "none";
        }

        // Show the current tab, and add an "active" class to the button that opened the tab
        document.getElementById("Question "+questionNumber).style.display = "block";
        event.currentTarget.className += " active";
        
        // hide all getHelpDivs, except the currently active one:
        document.getElementById("getHelpDiv" +questionNumber).style.display = "block";

        // set timer to the appropriate question, as long as exam is not yet finished
        if (examFinished === 0) {
            clearInterval(currentTimer);
            if (exam_data.timer_settings == "on") {
                currentTimer = setInterval(function() { timerFunctionOn(questionNumber) }, 1000);
            }
            else {
                currentTimer = setInterval(function() { timerFunctionOff(questionNumber) }, 1000);
            }
        }

    }
}

// Accepts the question number as an argument. Counts the seconds spent on that question.
function timerFunctionOn(questionNumber) {

    timers[questionNumber]++;
    timerSeconds = ("0" + (timers[questionNumber] % 60)).slice(-2);
    timerMinutes = (timers[questionNumber] - timerSeconds) / 60;
    document.getElementById("Timer "+questionNumber).innerHTML = timerMinutes + ":" + timerSeconds;
}

function timerFunctionOff(questionNumber) {

    timers[questionNumber]++;
}

function masterTimerFunctionOn() {

    masterTimer++;
    masterTimerSeconds--;
    if (masterTimerSeconds == -1) {
        masterTimerSeconds = 59;
        masterTimerMinutes--;
    }
    
    // flip timer if it goes negative, otherwise format seconds normally:
    if (masterTimerMinutes < 0) {
        masterTimerSecondsFormatted = ("0" + (59 - masterTimerSeconds)).slice(-2);
    }
    else {
        masterTimerSecondsFormatted = ("0" + masterTimerSeconds).slice(-2);
    }
    
    displayTime = masterTimerMinutes + ':' + masterTimerSecondsFormatted;
    document.getElementById("masterTimer").innerHTML = displayTime;
    
}

function masterTimerFunctionOff() {
    
    masterTimer++;
}

function finishedExam() {

    // set exam to finished:
    examFinished = 1;

    // stop the current timer:
    clearInterval(currentTimer);

    //stop the master timer:
    clearInterval(masterTimerInterval);

    // hide finished button:
    document.getElementById("finishedButton").style.display = "none";

    // Get all elements with class="answer" and show them
    answerContent = document.getElementsByClassName("ibmmanswer");
    for (i = 0; i < answerContent.length; i++) {
        answerContent[i].style.display = "block";
    }


}

function submitExam() {

    // check that all scores have been filled out
    scoreContent = document.getElementsByClassName("score");
    for (var i = 0, length = scoreContent.length; i < length; ++i) {
        if (scoreContent[i].value === null || scoreContent[i].value === '') {
            alert("Please enter your score for each question.");
            scores.length = 0;
            questionIds.length = 0;
            topics.length = 0;
            possibleMarks.length = 0;
            return false;
        }
        
        //
        scores.push(parseInt(scoreContent[i].value));
        questionIds.push(parseInt(exam_data.questions[i].question_id));
        topics.push(parseInt(exam_data.topics_chosen[i]));
        possibleMarks.push(parseInt(exam_data.questions[i].total_marks));
        console.log(topics[i]);
        
        // check if the entire array has been iterated through, then convert to JSON and pass to the form:
        if (i+1 == length){
            var JSONTimers = JSON.stringify(timers);
            var JSONScores = JSON.stringify(scores);
            var JSONQuestionIds = JSON.stringify(questionIds);
            var JSONTopics = JSON.stringify(topics);
            var JSONPossibleMarks = JSON.stringify(possibleMarks);

            // set hidden scores varaible to the inputted scores:
            document.getElementById('hiddenScoresVariable').value = JSONScores;

            // set hidden timers varaible to the timer array:
            document.getElementById('hiddenTimersVariable').value = JSONTimers;
            
            document.getElementById('hiddenQuestionIdsVariable').value = JSONQuestionIds;
            
            document.getElementById('hiddenTopicsVariable').value = JSONTopics;
            
            document.getElementById('hiddenPossibleMarksVariable').value = JSONPossibleMarks;
            

        }
    }
}

function createTabs() {
    // initialise timer functions:
    createTimers(exam_data.question_number);
    
    // create HTML tab buttons
    var tabs = "<div class=ibmmtab>", len = exam_data.question_number;
    for (let i = 0; i < len; i++) {
        tabs += '<button class="ibmmtablinks" onclick="openQuestion(event, ';
        tabs += i;
        tabs += ')">Question ';
        tabs += (i + 1);
        tabs += '</button>';
    }
    tabs += '</div>';
    document.getElementById("QuestionsTabs").innerHTML = tabs;
    
    // create HTML tab content (hidden with CSS stylesheet until clicked):
    tabs = '<form action="/analysis" method="post" id="resultsForm" onsubmit="return submitExam()">';
    for (let i = 0; i < len; i++) {
        tabs += '<div id="Question ';
        tabs += i;
        tabs += '" class="ibmmtabcontent"></br><p class="ibmmquestion">';
        tabs += exam_data.shortcoded_questions[i];
        tabs += '</p><div class="ibmmanswer"><br><br><hr>';
        tabs += exam_data.shortcoded_answers[i];
        tabs += '</div>Marks: ';
        tabs += exam_data.questions[i].total_marks;
        if (exam_data.timer_settings == "on") {
            tabs += '<br>Time taken: <span id="Timer ';
            tabs += i;
            tabs += '"></span>';
        }
        tabs += '<p class = "ibmmanswer">Score: <input type="number" class="score"></p></br><div id="reportProblemButton'
        tabs += i;
        tabs += '" class="ibmmanswer"><button type="button" onclick="showReportProblem('
        tabs += i;
        tabs += ')">Report a problem with this question/answer</button></div><div class="ibmmanswer"><button id="getHelpButton';
        tabs += i;
        tabs += '" type="button" class="ibmmbutton" style="float:right" onclick="showNewTopic(';
        tabs += i;
        tabs += ')">Ask a Question</button></br></br>';
        tabs += '</div></div>';
    }
    
    // add hidden fields for form submission, and other use info:
    tabs += '<input id="hiddenTimersVariable" type="hidden" value="" name="timers"><input id="hiddenScoresVariable" type="hidden" value="" name="scores"><input id="hiddenTotalMarksVariable" type="hidden" value="';
    tabs += exam_data.total_marks;
    tabs += '" name="totalMarks"><input id="hiddenQuestionIdsVariable" type="hidden" value="" name="questionIds"><input id="hiddenTopicsVariable" type="hidden" value="" name="topics"><input id="hiddenPossibleMarksVariable" type="hidden" value="" name="possibleMarks"></br><div class="ibmmanswer"><input type="submit" value="Submit Exam Scores" class="ibmmbutton"></div></form><div><br>Total marks: ';
    tabs += exam_data.total_marks;
    tabs += '</div><br><br><div><button id="finishedButton" type="button" class="ibmmquestion ibmmbutton" onclick="finishedExam()">Finished Exam!</button></div>';
    if (exam_data.timer_settings != "off") {
        tabs += '</br>Exam time remaining: <span id="masterTimer"></span>';
    }
    for (let i = 0; i < len; i++) {
        tabs += '<div id="getHelpDiv';
        tabs += i;
        tabs += '" class="ibmmhelpform"></div>';
    }
    document.getElementById("QuestionsTabsContent").innerHTML = tabs;
    
}

function showReportProblem(questionNumber) {
    
    reportProblemButtonId = "reportProblemButton" + questionNumber;
    textArea = '</br>Describe the issue below. You don\'t need to specify which question you are talking about. The report will be submitted when you submit exam scores.</br><textarea id="reportProblemTextarea" rows="20" cols="145" form="resultsForm" name="reportedProblems'
    textArea += questionNumber;
    textArea += '"></textarea>';
    document.getElementById(reportProblemButtonId).innerHTML = textArea;
}

function showNewTopic(i) {
    
    document.getElementById("getHelpDiv" + i).innerHTML = exam_data.shortcoded_new_topics[i];
    document.getElementById("getHelpButton" + i).style.display = "none";
    
    // iterate through and change links to no-follow:
    newTopicForms = document.getElementsByName("new-post");
    for (i = 0; i < newTopicForms.length; i++) {
            newTopicForms[i].setAttribute("target", "_blank");
        }
}