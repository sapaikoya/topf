angular.module('topface.controllers', [])



        .controller('calcCtrl', function($scope, $rootScope) {

            $scope.fraction = [
                {divider:'', denominator:''},
                {divider:'', denominator:''}
            ];
            $scope.fractionsigns = ['+'];

            $scope.result = {divider:'', denominator:'',sign:false};

            $scope.addFraction = function(){
                $scope.fraction.push({divider:'', denominator:''});
                $scope.fractionsigns.push('+');
            }

            function validate() {
                _.each($scope.fraction,function(el){
                    if(typeof el.divider != 'number' || el.divider == '') return true;
                    if(typeof el.denominator != 'number' || el.denominator == '') return true;
                });

            }

            $scope.calculate = function(newValue, oldValue){


                if(validate()){return false}
                var result = angular.copy($scope.fraction),
                    fractionsigns = angular.copy($scope.fractionsigns);



                function shrink(){ // сокращение дробей
                    _.each(result, function (el) {
                        el.denominator = parseFloat(el.denominator);
                        el.divider = parseFloat(el.divider);
                        if(el.denominator >0 && el.divider >0) {
                            for(var g=1; g < 5; g++) {
                                for (var i = 1; i < 1000; i++) {
                                    if (!(el.denominator % i || el.divider % i)) {
                                        el.divider = el.divider / i;
                                        el.denominator = el.denominator / i;
                                    }
                                }
                            }
                        }
                    })
                }



                function fresult() { // умножение и деление

                    _.each(fractionsigns, function (el, i) {

                        if (el == "*") {
                            result[i].divider = result[i].divider * result[i + 1].divider;
                            result[i].denominator = result[i].denominator * result[i + 1].denominator;
                            result.splice(i + 1, 1);
                            fractionsigns.splice(i, 1);
                            fresult();
                            return;
                        } else if (el == "/") {
                            result[i].divider = result[i].divider * result[i + 1].denominator;
                            result[i].denominator = result[i].denominator * result[i + 1].divider;
                            result.splice(i + 1, 1);
                            fractionsigns.splice(i, 1);
                            fresult();
                            return;
                        }
                    });

                }
                fresult();



                function share_denominator(i, g, result){ // поиск общего знаменателя


                    if(result[i].denominator > result[i + 1].denominator) {
                        var r = count_den(result[i],result[i + 1]);
                        result[i] = r.max;
                        result[i + 1] = r.min;

                    }else{
                        var r = count_den(result[i + 1],result[i]);
                        result[i] = r.min;
                        result[i + 1] = r.max;
                    }
                    function count_den(max, min){
                        if ((max.denominator * g) % min.denominator) {
                            g +=1;
                            share_denominator(i, g, result);
                        } else {
                            max.denominator = max.denominator * g;
                            max.divider = max.divider * g;
                            var key =  max.denominator / min.denominator;
                            min.denominator = min.denominator * key;
                            min.divider = min.divider * key;

                        }
                        return {
                            max: max,
                            min: min
                        }
                    }


                }
                function recycle_fractionsigns(){ // сложение и вычитание

                    _.each(fractionsigns, function (el, i) {
                        var g = 1;

                        if (el == "+") {

                            if (result[i].denominator != result[i + 1].denominator) share_denominator(i, g, result);

                            result[i].divider = parseFloat(result[i].divider) +  parseFloat(result[i + 1].divider);
                            result.splice(i+1, 1);
                            fractionsigns.splice(i, 1);
                            recycle_fractionsigns();

                        }
                        if (el == "-") {

                            if (result[i].denominator != result[i + 1].denominator) share_denominator(i, g, result);

                            result[i].divider = parseFloat(result[i].divider) -  parseFloat(result[i + 1].divider);
                            result.splice(i+1, 1);
                            fractionsigns.splice(i, 1);

                            recycle_fractionsigns();

                        }
                    });

                }
                recycle_fractionsigns();
                shrink();
                $scope.result.sign = (result[0].divider < 0)? true:false;
                $scope.result.divider = Math.abs(result[0].divider);
                $scope.result.denominator = result[0].denominator;


            }
            $rootScope.$on('onCalculate',$scope.calculate);
            $scope.$watch('fraction',$scope.calculate,true);
        })

    ;

