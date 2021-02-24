
let postList = getChildDivs('#board')
let gameWon = false
let moves = 0
const winningOrder = getChildDivs('#' + postList[0].id).map(item => parseInt(item.dataset.order))
const movesTracker = document.querySelector('#movesTracker')

postList.forEach(function (post) {
    post = getChildDivs('#' + post.id)
	if(post.length > 0)
    post[0].addEventListener('mousedown', clickFunction)
})

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
    const distanceFromBottom = 45*(getChildDivs('#'+startingPost.id).length - 1)

	//create point clicked on within the div
	let shiftX = event.clientX - event.target.getBoundingClientRect().left + leftMargin
	let shiftY = event.clientY - event.target.getBoundingClientRect().top + marginTop + distanceFromBottom

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
		if (currentPost &&
             (getChildDivs("#" + currentPost.id).length == 0 ||
              getDiskAsInt(event.target) < getDiskAsInt(getChildDivs("#" + currentPost.id)[0]))) {
            
            
            moves++
            movesTracker.innerText = `moves: ${moves}`
			if(getChildDivs("#" + currentPost.id).length > 0){
                const div = makeDiv(event.target)
                event.target.remove();
                currentPost.prepend(div);
                checkWin(div)
                div.addEventListener('mousedown', clickFunction);
                getChildDivs('#' + currentPost.id)[1].removeEventListener(
					'mousedown',
					clickFunction
				);

                if(getChildDivs('#' + startingPost.id).length >0){
                    getChildDivs('#' + startingPost.id)[0].addEventListener(
						'mousedown',
						clickFunction
					);
                }
            }else{
                const div = makeDiv(event.target)
				event.target.remove();
				currentPost.prepend(div);
                checkWin(div)
				div.addEventListener('mousedown', clickFunction);
                if (getChildDivs('#' + startingPost.id).length > 0) {
					getChildDivs('#' + startingPost.id)[0].addEventListener(
						'mousedown',
						clickFunction
					);
				}
            }
		} else {
            const div = makeDiv(event.target)
			event.target.remove();
			startingPost.prepend(div);
			div.addEventListener('mousedown', clickFunction);
		}
		document.removeEventListener('mousemove', onMouseMove);
		event.target.onmouseup = null;
	});

	function enterPost(element) {}

	function leavingPost(element) {}
	
}

function getChildDivs(post){
    if (document.querySelector(post).childNodes.length > 0){
		return Array.from(document.querySelector(post).childNodes).filter((node) => 
        node.tagName ==='DIV'
        );
    }else{
        return [];
    }
}

function checkWin(div){
    result = true
    const postNumArray = getChildDivs('#' + div.parentElement.id).map(item => parseInt(item.dataset.order))
    console.log(postNumArray)
    console.log(winningOrder)
    if(div.parentNode.id == 'post-1' || postNumArray.length !== winningOrder.length){
        result = false
    }else{
        for(let i = 0; i<postNumArray.length; i++){
            if(postNumArray[i] !== winningOrder[i]){
                result = false
            }
        }
    }
    console.log(result)
    return result
}

function getDiskAsInt(disk){
    return parseInt(disk.dataset.order)
}

function makeDiv(template){
    let div = document.createElement('DIV');
	div.classList.add('disk');
	div.id = template.id;
	div.dataset.order = template.dataset.order
    return div
}