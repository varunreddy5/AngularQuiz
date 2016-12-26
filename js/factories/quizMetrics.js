myApp.factory("quizMetrics",QuizMetrics);
	QuizMetrics.$inject=['dataServices'];
	function QuizMetrics(dataServices){
		var quizObj={
			quizActive:false,
			resultsActive:false,
			changeState:function(metric,state){
				if(metric==='quiz'){
					quizObj.quizActive=state;
				}else if(metric==="results"){
					quizObj.resultsActive=state;
				}else{
					return false;
				}
			},
			correctAnswers:[],
			numCorrect:0,
			markQuiz:function(){
				quizObj.correctAnswers=dataServices.correctAnswers;
				for(var i=0; i<dataServices.quizQuestions.length;i++){
					if(dataServices.quizQuestions[i].selected===dataServices.correctAnswers[i]){
						dataServices.quizQuestions[i].correct=true;
						quizObj.numCorrect++;
					}else{
						dataServices.quizQuestions[i].correct=false;
					}
				}
			}
		};
		return quizObj;
	}

	// function markQuiz(){
	// 	quizObj.correctAnswers=dataServices.correctAnswers;
	// 	for(var i=0; i<dataServices.quizQuesions.length;i++){
	// 		if(dataServices.quizQuesions[i].selected===dataServices.correctAnswers[i]){
	// 			dataServices.quizQuesions[i].correct=true;
	// 			quizObj.numCorrect++;
	// 		}else{
	// 			dataServices.quizQuesions[i].correct=false;
	// 		}
	// 	}
	// } 
