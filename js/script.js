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
    reset();
    var titolo = $('#search').val();
    var urlFilm = "https://api.themoviedb.org/3/search/movie";
    var urlSeries = "https://api.themoviedb.org/3/search/tv";
    var api_key = "d7eedefaa54e5ee2ac1df8e212654266";
    //ricerca dei film
    ricercaContenuto(urlFilm,api_key,titolo)
    //ricerca delle serie tv
    ricercaContenuto(urlSeries,api_key,titolo)
  }

  //funzione ricerca film
   function ricercaContenuto(url,api_key,titolo) {
     $.ajax({
       url : url,
       data : {
         "api_key" : api_key,
         "query" : titolo,
         "language" : "it-IT"
       },
       method : "GET",
       success : function (data) {
         console.log(data.results);
         if (url.includes("search/movie")) {
           stampaFilm(data.results);
         }else if (url.includes("search/tv")) {
           stampaSerieTV(data.results)
         }
       },
       error : function() {
           errore("Si è verificato un errore");
       }
     });
   }
  //funzione di supporto che stampa i film dalla barra di ricerca
  //PARAMETRO: array di oggetti ritornato dall'api
  function stampaFilm(arrayOggettiFilm) {
    var source = $('#tipologia-template').html();
    var template = Handlebars.compile(source);
    var tipologia = {"tipo" : "Film"};
    var html = template(tipologia);
    $('#objects').append(html);
    if (arrayOggettiFilm.length === 0) {
      errore("la ricerca non ha prodotto risultati nella sezione film");
    }else {
      var source = $('#lista-template').html();
      var template = Handlebars.compile(source);
      for (var i = 0; i < arrayOggettiFilm.length; i++) {

        //trasfotmo prima il voto per visualizzare stelle
        var voto = arrayOggettiFilm[i].vote_average;
        voto = trasformaVoto(voto);

        //trasformo lingua con bandiera corrispondente
        var bandiera = arrayOggettiFilm[i].original_language;
        bandiera = trasformaLingua(bandiera);

        var context = {
          "copertina" : stampaCopertina(arrayOggettiFilm[i].poster_path),
          "title" : arrayOggettiFilm[i].title,
          "original_title" : arrayOggettiFilm[i].original_title,
          "original_language" : bandiera,
          "vote_average" : voto
        };
        var html = template(context);
        $('#objects').append(html);
      }
    }
    //pulisco la barra di ricerca
    $('#search').val('');
  }

  //funzione di supporto che stampa le serie tv dalla barra di ricerca
  //PARAMETRO: array di oggetti ritornato dall'api
  function stampaSerieTV(arrayOggettiSerie) {
    var source = $('#tipologia-template').html();
    var template = Handlebars.compile(source);
    var tipologia = {"tipo" : "Serie TV"};
    var html = template(tipologia);
    $('#objects').append(html);
    if (arrayOggettiSerie.length === 0) {
      errore("la ricerca non ha prodotto risultati nella sezione serie tv");
    }else {
      var source = $('#lista-template').html();
      var template = Handlebars.compile(source);
      for (var i = 0; i < arrayOggettiSerie.length; i++) {

        //trasfotmo prima il voto per visualizzare stelle
        var voto = arrayOggettiSerie[i].vote_average;
        voto = trasformaVoto(voto);

        //trasformo lingua con bandiera corrispondente
        var bandiera = arrayOggettiSerie[i].original_language;
        bandiera = trasformaLingua(bandiera);
        var context = {
          "copertina" : stampaCopertina(arrayOggettiSerie[i].poster_path),
          "title" : arrayOggettiSerie[i].name,
          "original_title" : arrayOggettiSerie[i].original_name,
          "original_language" : bandiera,
          "vote_average" : voto
        };
        var html = template(context);
        $('#objects').append(html);
      }
    }
    //pulisco la barra di ricerca
    $('#search').val('');
  }

  //messaggio in caso la ricerca non dia risultati
  function errore(messaggio) {
    var source = $('#errore-template').html();
    var template = Handlebars.compile(source);
    var context = {
      "errore" : messaggio
    }
    var html = template(context);
    $('#objects').append(html);
  }

  //pulisco i risultati precdenti
  function reset() {
    $('#objects').html('');
  }
  //trasfotmo il voto decimale in una scala da 0 a 5 e ritorno le stelle corrispondenti
  //PARAMETRO: voto in decimale
  //RETURN: rappresentazione con stelle
  function trasformaVoto(numero){
    numero = Math.ceil(numero/2);
    var stelle = '';
    for (var i = 0; i < numero; i++) {
      stelle += "<i class=\"fas fa-star\"></i>";
    }
    for (var i = 0; i < 5-numero; i++) {
      stelle += "<i class=\"far fa-star\"></i>";
    }
    return stelle;
  }
  //trasformo la lingua dell'oggetto da stringa a bandiera, se disponibile
  function trasformaLingua(lingua) {
    switch (lingua) {
      case "it":
        lingua = '<img src="https://cdn.countryflags.com/thumbs/italy/flag-3d-round-250.png" alt="it">'
        break;
      case "en":
        lingua = '<img src="https://icons.iconarchive.com/icons/iconscity/flags/256/uk-icon.png" alt="en">'
        break;
      case "fr":
        lingua = '<img src="https://cdn.countryflags.com/thumbs/france/flag-3d-round-250.png" alt="fr">'
        break;
      default:
        lingua = lingua;
    }
    return lingua;
  }

  function stampaCopertina(url){
    var finalUrl = "https://image.tmdb.org/t/p/" + "w185" + url;
    return finalUrl;
  }
});
