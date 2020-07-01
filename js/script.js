$(document).ready(function () {

  //evento di ricerca film al click del bottone
  $(document).on('click','#button_search',
  function () {
    // do la possibilita di cercare solo se stringa non vuota
    if ($('#search').val().trim() != ''){
      ricerca();
    }

  });
  //evento di ricerca film al premere del tasto invio
  $('#search').keypress(function (event) {
    // do la possibilita di cercare solo se stringa non vuota
    if (event.which == 13 && $('#search').val().trim() != '') {
      ricerca();
    }
  });




  //FUNZIONI

  //funzione ricerca film
  //interrogo l'api per soddisfare la richiesta dell'utente
  //stampo i dati dei film trovati
  function ricerca(){
    var titolo = $('#search').val();
    $.ajax({
      url : "https://api.themoviedb.org/3/search/movie",
      data : {
        "api_key" : "d7eedefaa54e5ee2ac1df8e212654266",
        "query" : titolo,
        "language" : "it-IT"
      },
      method : "GET",
      success : function (data) {
        console.log(data.results);
        stampa(data.results);
      },
      error : function() {
          alert("Si è verificato un errore");
      }

    });
  }


  //funzione di supporto che stampa i film dalla barra di ricerca
  //PARAMETRO: array di oggetti ritornato dall'api
  function stampa(arrayOggettiFilm) {
    //prima camcello eventuali altre ricerche
    $('ul.film').remove();
    var source = $('#lista-template').html();
    var template = Handlebars.compile(source);
    for (var i = 0; i < arrayOggettiFilm.length; i++) {
      var context = {
        "title" : arrayOggettiFilm[i].title,
        "original_title" : arrayOggettiFilm[i].original_title,
        "original_language" : arrayOggettiFilm[i].original_language,
        "vote_average" : arrayOggettiFilm[i].vote_average
      }
      var html = template(context);
      $('.container').append(html);
    }
    //pulisco la barra di ricerca
    $('#search').val('');
  }
});
