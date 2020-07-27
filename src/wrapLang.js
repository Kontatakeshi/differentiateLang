
function initContainer() {
  /*createElement once, attach to DocumentFragment, and re-assign the
  document fragment node to the container for less DOM access.*/
  let formatContainer = document.createElement("span"),
      formatCache = new DocumentFragment();
  formatCache.appendChild(formatContainer);
  formatContainer = formatCache.querySelector("span");
  return formatContainer;
}
/*
put the first branch into a stack by pushing the firstChild's iteratively.
then process the node at the top.
push nextSibling in, if no nextSibling, pop.
then move to the nextSibling.
*/

function initialPush(node){
  stack.push(node);
  if (node.firstChild && !node.firstChild.textContent) {//indentations of html code in editor create text nodes, watch out.
    //looks like the best way to eliminate the indentations is compressing the html code with a preprocessor. wtf
    // condition used to be node.firstChild !== null, keep an eye on it.
    initialPush(node.firstChild);
  }
  return stack;
}

function processNode(node){
  stack.push(node);
  switch (node.nodeType) {
    case 1:
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
  let siblings = {};
  if (breakPoints) {
    //expected: if breakPoints returned is not null, proceed to text manipulation
    siblings = splitIt(node, breakPoints);
    siblings.target = setLang(siblings.target);
    siblings.target.parentNode.insertBefore(siblings.target, siblings.toBeProcessed);//J.F.C.
    processText(siblings.toBeProcessed);
    /*failed attempt: no way to change the original text node to a element node simply by assigning a element node from fragement rn. have to use the ugly way, insertBefore().
    let toBeWrapped = siblings.target.textContent;
    toBeWrapped = setLang(toBeWrapped);
    siblings.target = toBeWrapped;
    */
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
    /*Attention:
    the value pair way to create this object may cause problem.
    ublike funcution, you cannot refer to its property when the object isnt initiallized. the following statement is illegal.
    let breakPoints = {
      //R for Rear, F for Front
      R : regex.lastIndex,
      F : breakPoints.R - subStrings[0].length
    };*/
  }
  return breakPoints;
}
function splitIt(textNode, breakPoints){
  let remaining , eng;
  if (breakPoints.F === 0) {
    remaining = textNode.splitText(breakPoints.R);
    eng = textNode;
  } else {
    remaining = textNode.splitText(breakPoints.R);
    eng = textNode.splitText(breakPoints.F);
  }
  siblings = {
    toBeProcessed : remaining,
    target : eng
  }
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
  let next = this.nextSibling;
  if (next === null){
    callBack();
  } else {
    stack.push(next);
    processNode(next);
  }
}
function callBack() {
  let stackTop;//stack top has to be cached for re-pushing, otherwise stack.push(stack.pop()) doesn't change anything of the stack.
  while (stackTop = stack.pop(), stackTop.previousSibling) {
    stack.push(stackTop);
    stack.pop();
  }
  stack.pop();
  processNode(stack.pop());
}

let formatContainer = initContainer();
let stack = new Array();//declare the main stack globally
let main = document.getElementsByTagName("main");
stack = initialPush(main);
process(stack.pop());
