
   
$(function(){
	var param = {
		isMoving: 	false,
		startX: 	0,
		startY: 	0,
		diffX:		0,
		diffY:		0
	};
	
	// attach event
	$('#target').on('touchstart mousedown', toggleCalcTongueStart);
	$('#target').on('touchmove mousemove', toggleCalcTongue);
	$('#target').on('touchend mouseup', toggleCalcTongueEnd);
	
	function toggleCalcTongueStart(event) {
		param.isMoving = true;
	
		if (event.type === 'touchstart') {
			// IMPORTANT: stop any touches on this container from scrolling the page
			 event.preventDefault();
		
			// test
			console.log('1: touch start');
			
			// use with native js addEventListener
			//var touches = event.touches[0];
			//var touches = event.changedTouches[0];
			// use with jquery .on
			var touches = event.originalEvent.touches[0];
			 
			param.startX = touches.pageX;
			param.startY = touches.pageY;
			
			// test
			$('#start').html('1-1: startX: ' + param.startX + ', startY: ' + param.startY);
		}/*
		else if (event.type === 'mousedown' && !('ontouchstart' in document.documentElement)) {
			// test
			console.log('1-2: mousedown');
		
			//console.log(event);
			param.startX = event.pageX;
			param.startY = event.pageY;
			
			// test
			$('#start').html('1-2: startX: ' + param.startX + ', startY: ' + param.startY);
		}*/
	};
	
	
	function toggleCalcTongue(event) { 
		
		if (param.isMoving === true) {
		
			if (event.type === 'touchmove') {
				//test
				console.log('2: touching');
			
				// IMPORTANT: stop any touches on this container from scrolling the page
				 event.preventDefault();
			
				//var touches = event.touches[0];
				var touches = event.originalEvent.touches[0];
				 
				param.diffX = touches.pageX - param.startX;
				param.diffY = touches.pageY - param.startY;
				
				// test 
				$('#startMove').html('2-1: startMoveX: ' + touches.pageX + ', startMoveY: ' + touches.pageY); 
				$('#to').html('2-1: diffX: ' + param.diffX + ', diffY: ' + param.diffY); 
				
				// if moves vertically (min 20px up|down)??
				if ((Math.abs(param.diffX) < Math.abs(param.diffY)) &&  Math.abs(param.diffY) > 20) {
					//test
					$('#isMoving').html('yes dragging');
					
					if ($(this).hasClass('show-tongue') && param.diffY < -20) {
						$(this).removeClass('show-tongue').addClass('hide-tongue');
					}
					else if ($(this).hasClass('hide-tongue') && param.diffY > 20) {
						$(this).removeClass('hide-tongue').addClass('show-tongue');
					} 
				}
				else {
					// test
					$('#isMoving').html('no drag');
				}
			}/*
			else if (event.type === 'mousemove' && !('ontouchmove' in document.documentElement)) {
		
				param.diffX = event.pageX - param.startX;
				param.diffY = event.pageY - param.startY;
				
				// test 
				$('#startMove').html('2-2: startMoveX: ' + event.pageX + ', startMoveY: ' + event.pageY); 
				$('#diff').html('2-2: diffX: ' + param.diffX + ', diffY: ' + param.diffY); 
				
				// if moves vertically (min 20px up|down)??
				if ((Math.abs(param.diffX) < Math.abs(param.diffY)) &&  Math.abs(param.diffY) > 20) {
					//test
					$('#isMoving').html('yes dragging');
					
					if ($(this).hasClass('show') && param.diffY < -20) {
						$(this).removeClass('show').addClass('hide');
					}
					else if ($(this).hasClass('hide') && param.diffY > 20) {
						$(this).removeClass('hide').addClass('show');
					} 
				}
				else {
					// test
					$('#isMoving').html('no drag');
				} 
			}*/
		}
	};
	
	function toggleCalcTongueEnd () {
		
		param.isMoving = false;
	
		if (event.type === 'touchend') { 
			// test
			console.log('3: touchend');
		}
		else if (event.type === 'mouseup' && !('ontouchmove' in document.documentElement)) { }
	};
	
});