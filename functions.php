<?php
function my_theme_enqueue_styles() {
    wp_enqueue_style( 'parent-style', get_template_directory_uri() . '/style.css' );
}
add_action( 'wp_enqueue_scripts', 'my_theme_enqueue_styles' );



function enqueue_exam_generator_script() {

    // only continue if the page being loaded is the exam page:    
    if ( !is_page( 'exam' ) )
        return;
        
    // declare $wpdb as a global variable:
    global $wpdb;
    
    // declare other variables:
    $time = $_POST["time"];
    $topics = $_POST["topics"];
    $topics_chosen = [];
    $questions_and_answers = [];
    $total_marks = 0;
    $question_number = 0;
    $loop_broken = 0;
    $question_text = 0;
    $timer_settings = $_POST["timers"];
    $shortcoded_new_topics = [];
    
    // enqueue the exam generating javascript:
    wp_enqueue_script(
        'exam-generator-script',
        '/wp-content/themes/divi-child/exam-generator.js'
    );
    
    // randomise topic order:
    shuffle($topics);
    
    while (true) {
        if (is_array($topics) || is_object($topics)) {
            foreach ($topics as $topic) {
                if ($total_marks < ($time - 6)) {
                    $new_row = $wpdb->get_row( $wpdb->prepare("SELECT question_id, total_marks FROM wp88_mathsl_question WHERE topic_id = %d ORDER BY RAND()", $topic) );
                }
                elseif ($total_marks >= $time) {
                    $loop_broken = 1;
                    break;
                }
                else {
                    $remaining = $time - $total_marks;
                    $new_row = $wpdb->get_row( $wpdb->prepare("SELECT question_id, total_marks FROM wp88_mathsl_question WHERE topic_id = %d AND total_marks = %d ORDER BY RAND()", $topic, $remaining) );
                    if ($new_row == null) {
                        $loop_broken = 1;
                        break;
                    }
                    $questions[] = $new_row;
                    $total_marks += $new_row->total_marks;
                    $question_id = $new_row->question_id;
                    $child_new_row = $wpdb->get_row( $wpdb->prepare("SELECT question_text, answer_text FROM wp88_mathsl_question_child WHERE question_id = %d ORDER BY RAND()", $question_id));
                    $question_text = $child_new_row->question_text;
                    $shortcoded_question = do_shortcode($child_new_row->question_text);
                    $shortcoded_answer = do_shortcode($child_new_row->answer_text);
                    $shortcoded_questions[] = $shortcoded_question;
                    $shortcoded_answers[] = $shortcoded_answer;
                    $questions_and_answers[] = $child_new_row;
                    $question_number += 1;
                    $topics_chosen[] = $topic;
                    // append correct shortcoded new topic to array:
                    $shortcoded_new_topics[] = shortcode_new_topic($topic);
                    $loop_broken = 1;
                    break;
                }
                
                $questions[] = $new_row;
                $total_marks += $new_row->total_marks;
                $question_id = $new_row->question_id;
                $question_number += 1;
                $topics_chosen[] = $topic;
                $child_new_row = $wpdb->get_row( $wpdb->prepare("SELECT question_text, answer_text FROM wp88_mathsl_question_child WHERE question_id = %d ORDER BY RAND()", $question_id));
                $shortcoded_question = do_shortcode($child_new_row->question_text);
                $shortcoded_answer = do_shortcode($child_new_row->answer_text);
                $shortcoded_questions[] = $shortcoded_question;
                $shortcoded_answers[] = $shortcoded_answer;
                $shortcoded_new_topics[] = shortcode_new_topic($topic);
            }
            
            if ($loop_broken == 1) {
                break;
            }
            
        }
        else {
            break;
        }
    }
    
    
    wp_localize_script(
        'exam-generator-script',
        'exam_data',
        array(
            "time" => $time,
            "topics_chosen" => $topics_chosen,
            "question_number" => $question_number,
            "questions" => $questions,
            "total_marks" => $total_marks,
            "shortcoded_questions" => $shortcoded_questions,
            "shortcoded_answers" => $shortcoded_answers,
            "timer_settings" => $timer_settings,
            "shortcoded_new_topics" => $shortcoded_new_topics
        )
    );
    
    if ( class_exists( 'PC' ) ) { 
        PC::debug( $questions, 'Questions' );
        //PC::debug( $time, 'Time' );
        //PC::debug( $question_number, 'Question Number' );
        //PC::debug( $total_marks, 'Total Marks' );
        //PC::debug( $topics_chosen, 'Topics Chosen' );
        //PC::debug( $questions_and_answers, 'Questions and answers' );
        //PC::debug( $question_text, 'Questions Text' );
        //PC::debug( $shortcoded_questions, 'Shortcoded Questions' );
        PC::debug( $_POST, 'POST' );
        PC::debug( $shortcoded_questions, 'Shortcoded questions' );
        PC::debug( $shortcoded_new_topics, 'Shortcoded New Topics' );
    }
    
//;
    
}

function enqueue_analysis_generator_script() {
  
   // only continue if the page being loaded is the analysis page:    
    if ( !is_page( 'analysis' ) )
        return;
        
    // declare $wpdb as a global variable:
    global $wpdb;
    
    // initialise other variables:
    $timers = json_decode($_POST["timers"]);
    $scores = json_decode($_POST["scores"]);
    $topics = json_decode($_POST["topics"]);
    $possibleMarks = json_decode($_POST["possibleMarks"]);
    $totalMarks = $_POST["totalMarks"];
    $questionIds = json_decode($_POST["questionIds"]);
    $userId = get_current_user_id();
    $totalQuestions = count($questionIds);
    $testCounter = 0;
    
    
    
    if ( class_exists( 'PC' ) ) { 
        PC::debug( $timers, 'Timers' );
        PC::debug( $scores, 'Scores' );
        PC::debug( $totalMarks, 'Total Marks' );
        PC::debug( $questionIds, 'Questions IDs' );
        PC::debug( $totalQuestions, 'Total Questions' );
        
    }
    
    // enqueue the analysis generating javascript:
    wp_enqueue_script(
        'analysis-generator-script',
        '/wp-content/themes/divi-child/analysis-generator.js');
    
    // Insert attempt data for each question
    for ($i = 0; $i < $totalQuestions; $i++) {
        $testCounter++;
        $wpdb->show_errors();
        $wpdb->insert( 'wp88_mathsl_attempt',
                        array(
                                'user_id' => $userId,
                                'question_id' => $questionIds[$i],
                                'score' => $scores[$i],
                                'time' => $timers[$i],
                                'exam_mode' => 1
                            ),
                        array(
                                '%d',
                                '%d',
                                '%d',
                                '%d'
                            )
        );
        
        // get question metadata:
        $question_metadata = $wpdb->get_results( $wpdb->prepare("SELECT * FROM wp88_mathsl_question WHERE question_id = %d", $questionIds[$i]) );
        
        //extract and update important metadata:
        $total_attempts = $question_metadata[0]->total_attempts + $possibleMarks[$i];
        $total_score_all_users = $question_metadata[0]->total_score_all_users + $scores[$i];
        
        // calculate elo:
        $eloKey = "mathsl_elo_" . $question_metadata[0]->topic_id;
        $userElo = get_user_meta($userId, $eloKey, true);
        $questionElo = $question_metadata[0]->elo;
        $R1 = pow(10, ($userElo/400));
        $R2 = pow(10, ($questionElo/400));
        $E1 = $R1 / ($R1 + $R2);
        $E2 = $R2 / ($R1 + $R2);
        
        //calculate score, adjusting for going overtime:
        if ($timers[$i] <= $possibleMarks[$i]*60 + 60) {
            $fractionCorrect = $scores[$i]/$possibleMarks[$i];
        }
        elseif ($timers[$i] <= $possibleMarks[$i]*120) {
            $fractionCorrect = ($scores[$i]-1)/$possibleMarks[$i];
        }
        elseif ($timers[$i] <= $possibleMarks[$i]*180) {
            $fractionCorrect = ($scores[$i]-2)/$possibleMarks[$i];
        }
        elseif ($timers[$i] <= $possibleMarks[$i]*240) {
            $fractionCorrect = ($scores[$i]-3)/$possibleMarks[$i];
        }
        elseif ($timers[$i] <= $possibleMarks[$i]*300) {
            $fractionCorrect = ($scores[$i]-4)/$possibleMarks[$i];
        }
        else {
            $fractionCorrect = ($scores[$i]-5)/$possibleMarks[$i];
        }
        // if negative, set to zero:
        if ($fractionCorrect < 0) {
            $fractionCorrect = 0;
        }
        
        $newUserElo = $userElo + 20*($fractionCorrect - $E1);
        $newQuestionElo = $questionElo + 20*((1 - $fractionCorrect) - $E2);
        update_user_meta($userId, $eloKey, $newUserElo);
        
        // update question metadata:
        $wpdb->update( 'wp88_mathsl_question',
                        array(
                                'total_attempts' => $total_attempts,
                                'total_score_all_users' => $total_score_all_users,
                                'elo' => $newQuestionElo
                            ),
                        //where:
                        array(
                                'question_id' => $questionIds[$i]),
                        //update format:
                        array(
                                '%d',
                                '%d',
                                '%d'),
                        //where format:
                        array(
                                '%d')
        );
        
        // Add error reports (if any):
        $problemName = "reportedProblems" . $i;
        if (isset($_POST[$problemName])) {
            $wpdb->insert( 'wp88_mathsl_problem_reports',
                        array(
                                'question_id' => $questionIds[$i],
                                'user_id' => $userId,
                                'report_text' => $_POST[$problemName]
                            ),
                        array(
                                '%d',
                                '%d',
                                '%s'
                            )
            );
        }
    }
    
    wp_localize_script(
        'analysis-generator-script',
        'analysis_data',
        array(
            "timers" => $timers,
            "scores" => $scores,
            "topics" => $topics,
            "possibleMarks" => $possibleMarks
        )
    );
    
    /*if ( class_exists( 'PC' ) ) { 
        PC::debug( $testCounter, 'Test Counter' );
        PC::debug( $possibleMarks, 'Possible Marks' );
        PC::debug( $topics, 'Topics' );
        PC::debug( $_POST, 'POST' );
        PC::debug( $question_metadata, 'Question Meta' );
    }*/

}

function enqueue_training_generator_script() {

    // only continue if the page being loaded is the training page:    
    if ( !is_page( 'training' ) )
        return;
        
    // declare $wpdb as a global variable:
    global $wpdb;
    
    // declare other variables:
    
    $attempt_submitted = false;
    $topic_total_marks = array(0, 0, 0, 0, 0, 0);
    $topic_total_scores = array(0, 0, 0, 0, 0, 0);
    $topic_weightings = array(0, 0, 0, 0, 0, 0);
    $topic_weightings_counter = 0;
    $user = get_current_user_id();
    $topics = get_user_meta($user, "mepr_topics", 1);
    $topics_changed = false;
    if (isset($_POST["questionScore"])) {
        $score = $_POST["questionScore"];
        $time = $_POST["questionTime"];
        $questionId = $_POST["questionId"];
        $change_topics = $_POST["changetopics"];
        $topics_changed = $_POST["topicsChanged"];
        $attempt_submitted = true;
    }
    
    //activate all topics if empty:
    if (count($topics) == 0) {
        $topics_changed = true;
        $change_topics = ["1", "2", "3", "4", "5", "6"];
    }
    
    $streak = handle_streak( $user, $attempt_submitted );
    
    if ( isset($_POST["reportedProblems"])) {
        $wpdb->insert( 'wp88_mathsl_problem_reports',
                        array(
                                'question_id' => $questionId,
                                'user_id' => $user,
                                'report_text' => $_POST["reportedProblems"]
                            ),
                        array(
                                '%d',
                                '%d',
                                '%s'
                            )
        );
    }
    
    // update user topic preferences if they have been changed:
    
    if ($topics_changed == true) {
        $new_topics_array = [];
        foreach ($change_topics as $new_topic) {
            $new_topics_array += [$new_topic=>"on"];
        }
        update_user_meta($user, "mepr_topics", $new_topics_array);
        $topics = $new_topics_array;
    }
    
    if (isset($score) && $time > 30) {
        // insert, as long as at least 30 second attempt:
        $wpdb->insert( 'wp88_mathsl_attempt',
                        array(
                                'user_id' => $user,
                                'question_id' => $questionId,
                                'score' => $score,
                                'time' => $time
                            ),
                        array(
                                '%d',
                                '%d',
                                '%d',
                                '%d'
                            )
        );
    
    
        // get metadata:
        $question_metadata = $wpdb->get_results( $wpdb->prepare("SELECT * FROM wp88_mathsl_question WHERE question_id = %d", $questionId) );
    
        //extract and update important metadata:
        $total_attempts = $question_metadata[0]->total_attempts + $question_metadata[0]->total_marks;
        $total_score_all_users = $question_metadata[0]->total_score_all_users + $score;
    
        // update elo:
        $eloKey = "mathsl_elo_" . $question_metadata[0]->topic_id;
        $userElo = get_user_meta($user, $eloKey, true);
        $questionElo = $question_metadata[0]->elo;
        $R1 = pow(10, ($userElo/400));
        $R2 = pow(10, ($questionElo/400));
        $E1 = $R1 / ($R1 + $R2);
        $E2 = $R2 / ($R1 + $R2);
            
        //calculate score, adjusting for going overtime:
        if ($time <= $question_metadata[0]->total_marks*60 + 60) {
            $fractionCorrect = $score/$question_metadata[0]->total_marks;
        }
        elseif ($time <= $question_metadata[0]->total_marks*120) {
            $fractionCorrect = ($score - 1)/$question_metadata[0]->total_marks;
        }
        elseif ($time <= $question_metadata[0]->total_marks*180) {
            $fractionCorrect = ($score - 2)/$question_metadata[0]->total_marks;
        }
        elseif ($time <= $question_metadata[0]->total_marks*240) {
            $fractionCorrect = ($score - 3)/$question_metadata[0]->total_marks;
        }
        elseif ($time <= $question_metadata[0]->total_marks*300) {
            $fractionCorrect = ($score - 4)/$question_metadata[0]->total_marks;
        }
        else {
            $fractionCorrect = ($score - 5)/$question_metadata[0]->total_marks;
        }
        // if negative, set to zero:
        if ($fractionCorrect < 0) {
            $fractionCorrect = 0;
        }
        
        $newUserElo = $userElo + 20*($fractionCorrect - $E1);
        $newQuestionElo = $questionElo + 20*((1 - $fractionCorrect) - $E2);
        update_user_meta($user, $eloKey, $newUserElo);
            
        // update question metadata:
        $wpdb->update( 'wp88_mathsl_question',
                        array(
                                'total_attempts' => $total_attempts,
                                'total_score_all_users' => $total_score_all_users,
                                'elo' => $newQuestionElo
                        ),
                        //where:
                        array(
                                'question_id' => $questionId),
                        //update format:
                        array(
                                '%d',
                                '%d',
                                '%d'),
                        //where format:
                        array(
                                '%d')
        );
    }
    
    // enqueue the exam generating javascript:
    wp_enqueue_script(
        'training-generator-script',
        '/wp-content/themes/divi-child/training-generator.js'
    );
    
    // get previous results:
    $prior_results = $wpdb->get_results( $wpdb->prepare("SELECT wp88_mathsl_attempt.score, wp88_mathsl_attempt.time, wp88_mathsl_question.total_marks, wp88_mathsl_question.topic_id FROM wp88_mathsl_attempt INNER JOIN wp88_mathsl_question ON wp88_mathsl_attempt.question_id = wp88_mathsl_question.question_id WHERE wp88_mathsl_attempt.user_id = %d", $user) );
    
    
    // process results by going through each, calulating percent correct and modifying based on time taken:
    foreach ($prior_results as &$prior_results) {
        
        // keep only answers with a reasonable time:
        if ($prior_results->time > 30) {
            
            // add total marks:
            $topic_total_scores[$prior_results->topic_id - 1] += $prior_results->score;
            
            // add scores, with time penalties:
            if ($prior_results->time < ($prior_results->total_marks * 60)) {
                
                $topic_total_marks[$prior_results->topic_id - 1] += $prior_results->total_marks;
                
            } elseif ($prior_results->time > ($prior_results->total_marks * 300)) {
                
                $topic_total_marks[$prior_results->topic_id - 1] += ($prior_results->total_marks - 3);
                
            } elseif ($prior_results->time > ($prior_results->total_marks * 180)) {
                
                $topic_total_marks[$prior_results->topic_id - 1] += ($prior_results->total_marks - 2);
            } else {
                
                $topic_total_marks[$prior_results->topic_id - 1] += ($prior_results->total_marks - 1);
            }
        }
        
    }
    
    // if less than 20 total marks are found, set to a moderate value (70). Otherwise generate a value between 110 and 10:
    for ($i = 0; $i < 6; $i++) {
        
        $topic_weightings[$i] = (int) 130 -  ($topic_total_scores[$i] / ($topic_total_marks[$i]+1) * 100);
        
        if ($topic_total_marks[$i] < 20) {
            $topic_weightings[$i] = 70;
        }
        
    }  

    $chosen_topic = topic_randomiser($topic_weightings) + 1;
    // if all or no topics selected, no need to re-randomise:
    if (count($topics) < 6) {
        // since $topics only contains entries which are "on", check null to find non-selected topics and re-randomise:
        while (!isset($topics[$chosen_topic])) {
            $chosen_topic = topic_randomiser($topic_weightings) + 1;
        }
    }
    
    if ( class_exists( 'PC' ) ) { 
        PC::debug( $streak, 'Streak' );
    }
    
    /*if ( class_exists( 'PC' ) ) { 
        PC::debug( $topic_weightings, 'Topic Weightings' );
        PC::debug( $shortcoded_question, 'Shortcoded Question' );
        PC::debug( $topic_forum_id, 'New Topic Code' );
        PC::debug( $chosen_topic, 'Chosen Topic' );
        PC::debug( $question_id, 'Question ID' );
        PC::debug( $topics, 'Topics' );
        PC::debug( $change_topics, 'Newly Selected Topics' );
        PC::debug( $score, 'Score' );
        PC::debug( $_POST, 'POST' );
    }*/


    //calculate upper and lower bound at the probability of 0.65 and 0.35

    $eloKey = "mathsl_elo_" . $chosen_topic;
    
    $userElo = get_user_meta($user, $eloKey, true);

    $upperProbability = 0.1;
    $lowerProbability = 0.9;

    $upperBound = log(1 / $upperProbability - 1, 10) * 400 + $userElo;
    $lowerBound = log(1 / $lowerProbability - 1, 10) * 400 + $userElo;

    // debug
    echo "topic: ".$chosen_topic."U: ". $upperBound. "L: ". $lowerBound;
    
    // get a random question and child:
    $new_row = $wpdb->get_row( $wpdb->prepare("SELECT question_id, total_marks, elo FROM wp88_mathsl_question WHERE topic_id = %d AND elo > %d AND elo < %d ORDER BY RAND()", $chosen_topic, $lowerBound, $upperBound) );
    $question_id = $new_row->question_id;
    $elo = $new_row->elo; // test difficulty get elo
    $child_new_row = $wpdb->get_row( $wpdb->prepare("SELECT question_text, answer_text FROM wp88_mathsl_question_child WHERE question_id = %d ORDER BY RAND()", $question_id));
    
    // fix images in questions by adding reference to parent directory:
    $shortcoded_question = do_shortcode(str_replace("images/", "../images/", $child_new_row->question_text));
    $shortcoded_answer = do_shortcode(str_replace("images/", "../images/", $child_new_row->answer_text));
    $question_id = $new_row->question_id;
    $available_marks = $new_row->total_marks;
    
    $shortcoded_new_topic = shortcode_new_topic($chosen_topic);
    
    
    // pass data to training-generator.js:
    wp_localize_script(
        'training-generator-script',
        'training_data',
        array(
            "question_id" => $question_id,
            "available_marks" => $available_marks,
            "shortcoded_question" => $shortcoded_question,
            "shortcoded_answer" => $shortcoded_answer,
            "shortcoded_new_topic" => $shortcoded_new_topic,
            "streak" => $streak,
            "selected_topics" => $topics,
            "elo" => $elo
        )
    );
    

    
}

function topic_randomiser(array $weighted_values) {
    $rand = mt_rand(1, (int) array_sum($weighted_values));
    
    foreach ($weighted_values as $topic => $weighting) {
        $rand -= $weighting;
        if ($rand <= 0) {
            return $topic;
        }
    }
}

// generate new topic shortcode. Note: topics run from 1 to 6.
function shortcode_new_topic($chosen_topic) {
    
    $topic_forum_id = ($chosen_topic * 2) + 25545;
    $new_topic_code = "[bbp-topic-form forum_id={topic_forum_id}]";
    $shortcoded_new_topic = do_shortcode(str_replace("{topic_forum_id}", $topic_forum_id, $new_topic_code));
    return $shortcoded_new_topic;
    
}

function enqueue_tester_script() {
  
   // only continue if the page being loaded is the tester page:    
    if ( !is_page( 'tester-results' ) )
        return;
        
    // declare $wpdb as a global variable:
    global $wpdb;
    
    // initialise other variables:
    $testerquestion = stripslashes($_POST["question"]);
    $testeranswer = stripslashes($_POST["answer"]);
    $shortcoded_testerquestion = do_shortcode($testerquestion);
    $shortcoded_testeranswer = do_shortcode($testeranswer);
    
    // enqueue the testing javascript:
    wp_enqueue_script(
        'tester-script',
        '/wp-content/themes/divi-child/tester.js');
    
    wp_localize_script(
        'tester-script',
        'tester_data',
        array(
            "tester_question" => $shortcoded_testerquestion,
            "tester_answer" => $shortcoded_testeranswer
        )
    );
    
    if ( class_exists( 'PC' ) ) { 
        PC::debug( $shortcoded_testerquestion, 'Shortcoded question' );
        PC::debug( $shortcoded_testeranswer, 'Shortcoded answer' );
    }

}

function enqueue_fixer_script() {
    
    // only continue if the page being loaded is the fixer results page:
    if ( !is_page( 'fixer-results' ) )
        return;
        
    // set variables:
    global $wpdb;
    
    // get all children of the specified ID, if text search not selected:
    if ($_POST['textsearch'] != "on") {
        $questionId = $_POST["questionId"];
        $content = $wpdb->get_results( $wpdb->prepare("SELECT question_child_id, question_text, answer_text FROM wp88_mathsl_question_child WHERE question_id = %d", $questionId, ARRAY_N), ARRAY_N );
    }
    // otherwise do text search:
    else {
        $searchtext = '%' . $_POST['textsnippet'] . '%';
        $content = $wpdb->get_results( $wpdb->prepare("SELECT question_child_id, question_text, answer_text FROM wp88_mathsl_question_child WHERE question_text LIKE %s", $searchtext, ARRAY_N), ARRAY_N );
    }
    
    // enqueue the fixer javascript:
    wp_enqueue_script(
        'fixer-script',
        '/wp-content/themes/divi-child/fixer.js');
    
    wp_localize_script(
        'fixer-script',
        'fixer_data',
        array(
            "content" => $content,
        )
    );
    
    if ( class_exists( 'PC' ) ) { 
        PC::debug( $_POST, 'POST' );
    }

}

function enqueue_fixed_script() {
    
    // only continue if the page being loaded is the fixed page:
    if ( !is_page( 'fixed' ) )
        return;
        
    // set variables:
    global $wpdb;
    // 1 subtracted for ID, divided by two for questions+answers:
    $length = (count($_POST)-1)/2;
    $first_id = $_POST['firstId'];
    
    $wpdb->show_errors();
    
    
    for ($i=0; $i<$length; $i++) {
        $question_key = 'question' . ($first_id + $i);
        $answer_key = 'answer' . ($first_id + $i);
        $new_question_text = stripslashes_deep($_POST[$question_key]);
        $new_answer_text = stripslashes_deep($_POST[$answer_key]);
        $wpdb->update(
                'wp88_mathsl_question_child',
                array(
                    'question_text' => $new_question_text,
                    'answer_text' => $new_answer_text
                    ),
                    // where:
                    array('question_child_id' => $first_id+$i),
                    // format:
                    array('%s', '%s'),
                    // where format:
                    array('%d')
                );
    }
    
    if ( class_exists( 'PC' ) ) { 
        PC::debug( $_POST, 'POST' );
        PC::debug( $length, 'Length' );
        PC::debug( $question_key, 'QKey' );
        PC::debug( $answer_key, 'AKey' );
    }

}

function enqueue_added_script() {
    
    // only continue if the page being loaded is the fixed page:
    if ( !is_page( 'added' ) )
        return;
        
    // set variables:
    global $wpdb;
    $questionNumber = $_POST["questionnumber"];
    
    $wpdb->show_errors();
    
    for ($i=0; $i<$questionNumber; $i++) {
        $question_key = 'question' . ($i+1);
        $answer_key = 'answer' . ($i+1);
        $new_question_text = stripslashes_deep($_POST[$question_key]);
        $new_answer_text = stripslashes_deep($_POST[$answer_key]);
        $wpdb->insert(
                'wp88_mathsl_question_child',
                array(
                    'question_id' => $_POST['questionid'],
                    'question_text' => $new_question_text,
                    'answer_text' => $new_answer_text
                    ),
                    // format:
                    array('%d', '%s', '%s')
                );
    }
    
    if ( class_exists( 'PC' ) ) { 
        PC::debug( $_POST, 'POST' );
    }

}

function enqueue_beta_testers_script() {
   
    // only continue if the page being loaded is the beta tester report page:
    if ( !is_page( 'report-submitted' ) )
        return;
        
    // set variables:
    global $wpdb;
    $user = get_current_user_id();
    
    if ( isset($_POST["reportedProblems"])) {
        $wpdb->insert( 'wp88_mathsl_problem_reports',
                        array(
                                'question_id' => 0,
                                'user_id' => $user,
                                'report_text' => $_POST["reportedProblems"]
                            ),
                        array(
                                '%d',
                                '%d',
                                '%s'
                            )
        );
    }
    
    if ( class_exists( 'PC' ) ) { 
        PC::debug( $_POST, 'POST' );
    }
    
}

function enqueue_usermeta_script() {
    
    // only continue if the page being loaded is the usermeta page:
    if ( !is_page( 'usermeta' ) )
        return;
        
    $args = array('fields'=>'ID', "orderby"=>'ID');
    $users = get_users( $args );
    foreach ($users as $user) {
        $allElo[] = array();
        for ($i = 1; $i <= 6; $i++) {
            $eloKey = "mathsl_elo_" . $i;
            $allElo[$user][] = get_user_meta($user, $eloKey, true);
        }
    }

    if ( class_exists( 'PC' ) ) { 
        //PC::debug( $allElo, 'Elo' );
        //PC::debug( $users, 'Users' );
    }
    
    wp_enqueue_script(
        'usermeta-script',
        '/wp-content/themes/divi-child/usermeta-generator.js');
    
    wp_localize_script(
        'usermeta-script',
        'usermeta_data',
        array(
            "allElo" => $allElo,
            "users" => $users
        )
    ); 
    
}

function add_topics_metadata( $userId ) {
    
    update_user_meta($userId, "mepr_topics", [1=>"on", 2=>"on", 3=>"on", 4=>"on", 5=>"on", 6=>"on"]);
}

function handle_streak( $userId, $attemptSubmitted ) {
    
    //get current user streak count.
    $streak_count = get_user_meta($userId, "streak_count", true);
    
    // get last completed question by this user (datetime). 
    $last_attempt = get_user_meta($userId, "last_attempt", true);
    
    // get current and previous 24-hour localised periods.
    $localised_date = date_i18n( 'd/m/Y', false, false);
    $previous_date = "";
    
    
    // if attempt was submitted, check if last completed attempt was in the current 24 hour period. If so, do nothing. Otherwise, add 1 to current streak.
    if ($attemptSubmitted == true) {
        if ($last_attempt != $localised_date) {
            $streak_count = $streak_count + 1;
            update_user_meta($userId, "streak_count", $streak_count);
            update_user_meta($userId, "last_attempt", $localised_date);
        }
    }
    // if attempt was not submitted, check if last completed attempt was either today or yesterday. Reset streak if not.
    else {
        if ($last_attempt != $localised_date && last_attempt != previous_date) {
            $streak_count = 0;
            update_user_meta($userId, "streak_count", 0);
        }
    }
    
    if ( class_exists( 'PC' ) ) { 
        PC::debug( $localised_date, 'Date' );
    }

    return $streak_count;
}

function enqueue_walkthrough() {
    // walkthrough tester
    // only works when requesting oldone/something but membership doesn't work

    $executeWalkThrough = false;

    if(is_front_page() && is_first_time()) {
        $executeWalkThrough = true;
    }

    
    // only works for the front page and it's the first time visiting
    wp_enqueue_script(
        'walkthrough',
        '/wp-content/themes/divi-child/walkthrough.js'
    );

    wp_localize_script(
        'walkthrough',
        'data',
        array(
            "execute" => $executeWalkThrough,
        )
    );
    
}



function is_first_time() {
    if (isset($_COOKIE['_wp_first_time'])) {
        return false;
    } else {
        // expires in 30 days.
        setcookie('_wp_first_time', 1, time() + (WEEK_IN_SECONDS * 4), COOKIEPATH, COOKIE_DOMAIN, false);
        return true;
    }
}

function enqueue_hopscotch() {
        wp_enqueue_script(
            'hopscotch',
            '/wp-content/themes/divi-child/js/hopscotch.js'
        );
}

add_action( 'user_register', 'add_topics_metadata');
add_action( 'admin_post_create_exam', 'handle_exam_creation');
add_action( 'wp_enqueue_scripts', 'enqueue_hopscotch');
add_action( 'wp_enqueue_scripts', 'enqueue_walkthrough');
add_action( 'wp_enqueue_scripts', 'enqueue_exam_generator_script');
add_action( 'wp_enqueue_scripts', 'enqueue_training_generator_script');
add_action( 'wp_enqueue_scripts', 'enqueue_analysis_generator_script');
add_action( 'wp_enqueue_scripts', 'enqueue_tester_script');
add_action( 'wp_enqueue_scripts', 'enqueue_fixer_script');
add_action( 'wp_enqueue_scripts', 'enqueue_fixed_script');
add_action( 'wp_enqueue_scripts', 'enqueue_added_script');
add_action( 'wp_enqueue_scripts', 'enqueue_beta_testers_script');
add_action( 'wp_enqueue_scripts', 'enqueue_usermeta_script');
add_action( 'wp_enqueue_scripts', function() {
    wp_enqueue_style( 'style', get_stylesheet_uri() );
});

add_action( 'wp_enqueue_scripts', function() {
    wp_enqueue_style( 'hopscotch_style', '/wp-content/themes/divi-child/css/hopscotch.css' );
});