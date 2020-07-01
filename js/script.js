$(document).ready(function () {

  //d7eedefaa54e5ee2ac1df8e212654266

  //evento di ricerca film al click del bottone
  $(document).on('click','#button_search',
  function () {
    var testo = $('#search').val();
    ricerca(testo);
  });

  //funzione ricerca film
  function ricerca(titolo){
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


  //funzione che stampa i film dalla barra_ricerca
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
  }
});
