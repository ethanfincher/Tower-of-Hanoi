



let blockArray = Array.from(document.querySelectorAll('.disk'));
blockArray.forEach(function (disk) {
	disk.addEventListener('mousedown', clickFunction);
});

//the code below is refactored for my program from https://javascript.info/mouse-drag-and-drop
function clickFunction(event) {
	let currentPost = null;
	let startingPost = event.target.parentElement;
    let hasMoved = false

	//change styling so that ball is cleanly movable
    event.target.style.position = 'absolute';
	event.target.style.zIndex = 1000;
    const leftMargin = parseInt((window.getComputedStyle(event.target).getPropertyValue('margin-left')))
    const marginTop = parseInt(window.getComputedStyle(event.target).getPropertyValue('margin-top'));

	//create point clicked on within the div
	let shiftX = event.clientX - event.target.getBoundingClientRect().left + leftMargin
	let shiftY = event.clientY - event.target.getBoundingClientRect().top + marginTop

	// //move into body so that the absolute positioning responds to body
    
	// function to stick div to mouse location on square
	function moveTo(spotX, spotY) {
        if(!hasMoved){
            document.body.appendChild(event.target);
            hasMoved = true
        }
		event.target.style.left = spotX - shiftX + 'px';
		event.target.style.top = spotY - shiftY + 'px';
	}

	// //use event position to point under mouse using moveTo function
	function onMouseMove(moveEvent) {
		moveTo(moveEvent.pageX, moveEvent.pageY);
		//hide ball so we can check what is below it, then bring it back right after check
		event.target.hidden = true;
		//checks the point under the mouse for an element, match class later
		//clientX and clientY are new, basicly they are grid points on the html page depending on where your mouse is
		let elemBelow = document.elementFromPoint(
			moveEvent.clientX,
			moveEvent.clientY
		);
		event.target.hidden = false;

		//if there is no element below,
		if (!elemBelow) return;

		//set var postBelow equal to the elem if it is a post
		let postBelow = elemBelow.closest('.post');
		if (postBelow != currentPost) {
			if (currentPost) {
				leavingPost(currentPost);
			}
			currentPost = postBelow;
			if (currentPost) {
				enterPost(currentPost);
			}
		}
	}

	// //now use onMouceMove
	document.addEventListener('mousemove', onMouseMove);

	// //add drop disk functionality
	event.target.addEventListener('mouseup', (mouseUpEvent) => {
		//if there is a current post, attach the disk to it, else move it back to starting disk
		if (currentPost) {
			let div = document.createElement('DIV');
			div.classList.add('disk');
			div.id = event.target.id;
			currentPost.appendChild(div);
			div.addEventListener('mousedown', clickFunction);
			event.target.remove();
		} else {
			let div = document.createElement('DIV');
			div.classList.add('disk');
			div.id = event.target.id;
			startingPost.appendChild(div);
			div.addEventListener('mousedown', clickFunction);
			event.target.remove();
		}
		document.removeEventListener('mousemove', onMouseMove);
		event.target.onmouseup = null;
	});

	function enterPost(element) {}

	function leavingPost(element) {}
	//extra function to solve problem i didn't have
	// event.target.ondragstart = function () {
	// 	return false;
	// };
}


//make arrays for each ring
//rings consist of what disks and in what order the disks are in
//win if the order is 4-3-2-1 on either ring 2 or 3

//make so that you cn only move the top ring on each pole