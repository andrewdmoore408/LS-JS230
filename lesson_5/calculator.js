document.addEventListener('DOMContentLoaded', event => {
  const form = document.querySelector('form');

  form.addEventListener('submit', event => {
    event.preventDefault();
    event.stopPropagation();

    const first = parseInt(document.getElementById('first').value, 10);
    const second = parseInt(document.getElementById('second').value, 10);
    const op = document.getElementById('operation').value;
    const answerElement = document.getElementById('answer');

    let answer;

    switch (op) {
      case '+':
        answer = first + second;
        break;
      case '-':
        answer = first - second;
        break;
      case '*':
        answer = first * second;
        break;
      case '/':
        if (second === 0) {
          answer = 'ERROR: Divide by 0!'
        } else {
          answer = first / second;
        }

        break;
    }

    answerElement.textContent = answer;
  });
});