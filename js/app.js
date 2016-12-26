var myApp=angular.module('myApp',[]);
myApp.controller('mainController',['$scope','quizMetrics','dataServices',function($scope,quizMetrics,dataServices){
	$scope.quizMetrics=quizMetrics;
	$scope.data=dataServices.turtlesData;
	$scope.activeTurtle={};
	$scope.search="";
	$scope.changeActiveTurtle=function(index){
		$scope.activeTurtle=index;
	};
	$scope.activateQuiz=function(){
		quizMetrics.changeState("quiz",true);
	}
}]);

myApp.controller('quizController',['$scope','quizMetrics','dataServices',function($scope,quizMetrics,dataServices){
	$scope.quizMetrics=quizMetrics;
	$scope.dataServices=dataServices;
	$scope.activeQuestion=0;
	$scope.error=false;
	$scope.setActiveQuestion=setActiveQuestion;
	$scope.selectAnswer=selectAnswer;
	$scope.finaliseAnswers=finaliseAnswers;
	$scope.finalise=false;
	var numQuestionsAnswered=0;

	function setActiveQuestion(index){
		if(index===undefined){
			var breakOut=false;
			var quizLength=dataServices.quizQuestions.length-1;
			while(!breakOut){
				$scope.activeQuestion=$scope.activeQuestion<quizLength?++$scope.activeQuestion:0;
				if($scope.activeQuestion==0){
					$scope.error=true;
				}
				if(dataServices.quizQuestions[$scope.activeQuestion].selected==null){
					breakOut=true;
				}
			}
		}
		else{
			$scope.activeQuestion=index;
		}
		
	}
	$scope.questionAnswered=function(){
		var quizLength=dataServices.quizQuestions.length;
		if(dataServices.quizQuestions[$scope.activeQuestion].selected!==null){
			numQuestionsAnswered++;
			if(numQuestionsAnswered>=quizLength){
				//finalise Quiz
				for(var i=0;i<quizLength;i++){
					if(dataServices.quizQuestions[i].selected==null){
						setActiveQuestion(i);
						return;
					}
				}
				$scope.error=false;
				$scope.finalise=true;
				return;
			}
		}
		$scope.setActiveQuestion();
	}
	function selectAnswer(index){
		dataServices.quizQuestions[$scope.activeQuestion].selected=index;
		console.log(dataServices.quizQuestions[$scope.activeQuestion].selected);
	}
	function finaliseAnswers(){
		$scope.finalise=false;
		numQuestionsAnswered=0;
		$scope.activeQuestion=0;
		quizMetrics.markQuiz();
		quizMetrics.changeState("quiz",false);
		quizMetrics.changeState("results",true);

	}
}]);

myApp.controller('resultsController',['$scope','quizMetrics','dataServices',function($scope,quizMetrics,dataServices){
	$scope.quizMetrics=quizMetrics;
	$scope.dataServices=dataServices;
	$scope.activeQuestion=0;
	$scope.getAnswerClass=getAnswerClass;
	$scope.setActiveQuestion=setActiveQuestion;
	$scope.calculatePercentage=calculatePercentage;
	$scope.reset=reset;

	function calculatePercentage(){
		return quizMetrics.numCorrect/dataServices.quizQuestions.length*100;
	}
	function getAnswerClass(index){
		if(index===quizMetrics.correctAnswers[$scope.activeQuestion]){
			return 'bg-success';
		}else if(index===dataServices.quizQuestions[$scope.activeQuestion].selected){
			return 'bg-danger';
		}
	}

	function setActiveQuestion(index){
		$scope.activeQuestion=index;
	}
	function reset(){
		quizMetrics.changeState("results",false);
		quizMetrics.numCorrect=0;
		for(var i=0; i<dataServices.quizQuestions.length;i++){
			var data=dataServices.quizQuestions[i];

			data.selected=null;
			data.correct=null;
		}
	}
}]);