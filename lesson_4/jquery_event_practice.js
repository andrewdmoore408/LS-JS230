$(function() {
  let $toggleKey;

  $('form').submit(event => {
    event.preventDefault();

    $toggleKey = $('input[type=text]').val();
    
      $(document).off('keypress').on('keypress', event => {
    event.preventDefault();
    
    if (event.key === $toggleKey) {
			$('#toggleAccordion').trigger('click');
    }
  });

    console.log($toggleKey);
  });
  
  $('#toggleAccordion').click(event => {
    event.preventDefault();
    
    $('#accordion').slideToggle();
  });
});
