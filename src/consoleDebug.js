let formatContainer = initContainer();
let stack = new Array();//declare the main stack globally
let body = document.getElementsByTagName("body");
stack = initialPush(body[0]);
processNode(stack.pop());

function initContainer() {
  let formatContainer = document.createElement("span"),
      formatCache = new DocumentFragment();
  formatCache.appendChild(formatContainer);
  formatContainer = formatCache.querySelector("span");
  return formatContainer;
}

function initialPush(node){
  stack.push(node);
  if (node.firstChild) {
    //console.log(node.firstChild);
    initialPush(node.firstChild);
  }
  //console.log(stack);
  return stack;
}

function processNode(node){
  stack.push(node);
  switch (node.nodeType) {
    case 1:
      console.log(node);
      processEl(node);
      break;
    case 3:
      toBeProcessed = processText(node);
      break;
    default:
      alert("neither element nor text.\n something went wrong!");
  }
  proceed(toBeProcessed);//think it twice, might not refer to the right argument
}
function processEl(node){
  if (!node.firstChild) proceed(node);
  else processNode(node.firstChild);
}
function processText(node){
  string = node.textContent;
  breakPoints = checkCharac(string);
  let siblings = splitIt(node, breakPoints);
  if (breakPoints) {
    //expected: if breakPoints returned is not null, proceed to text manipulation
    let insertRef = siblings.target.parentNode;
    siblings.target = setLang(siblings.target);
    //console.log(insertRef, siblings.toBeProcessed)
    insertRef.insertBefore(siblings.target, siblings.toBeProcessed);//J.F.C.
    processText(siblings.toBeProcessed);
  } else {
    ;//literally do nothing and
  }
  return siblings.toBeProcessed;
}
function checkCharac(string){
  const regex = RegExp('[A-Za-z0-9_\.]*[A-Za-z0-9_\.]','g');
  //test method did cause problem on the Front breakPoint, use exec instead
  let subStrings = regex.exec(string);
  let breakPoints = {};
  if (subStrings === null) {
    breakPoints = null;
  } else {
    breakPoints.R = regex.lastIndex;
    breakPoints.F = breakPoints.R - subStrings[0].length;
  }
  return breakPoints;
}
function splitIt(textNode, breakPoints){
  let remaining , eng;
  if (!breakPoints) {
    remaining = textNode;
  } else if (breakPoints.F === 0) {
    remaining = textNode.splitText(breakPoints.R);
    eng = textNode;
  } else {
    remaining = textNode.splitText(breakPoints.R);
    eng = textNode.splitText(breakPoints.F);
  }
  siblings = {
    toBeProcessed : remaining,
    target : eng
  };
  return siblings;
}
function setLang(textNode) {
  //this is a little bitch, rn just use argument
  let container = formatContainer.cloneNode();
  container.setAttribute("lang","en");
  container.appendChild(textNode);
  return container;
}
function proceed(node) {
  console.log(node);
  let next = node.nextSibling;
  if (!next){
    //stack.push(node);
    console.log(stack);
    callBack(node);
  } else {
    stack.push(next);
    console.log(stack);
    processNode(next);
  }
}
function callBack(node) {
  ///let stkTop = stack.pop();//stack top has to be cached for re-pushing, otherwise stack.push(stack.pop()) doesn't change anything of the stack.
  //stack.push(stkTop);
  console.log(stack);
  while (node.previousSibling) {
    console.log(node.previousSibling, stack);
    node = stack.pop();
    console.log(stack);
  }
  console.log(stack);
  proceed(stack.pop());
}
