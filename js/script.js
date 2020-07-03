$(document).ready(function () {

  //EVENTI

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
         var type;
         if (url === "https://api.themoviedb.org/3/search/movie" ) {
           type = "Film"
           stampa(data.results,type);
         }else if (url === "https://api.themoviedb.org/3/search/tv") {
           type = "Serie TV"
           stampa(data.results,type)
         }
       },
       error : function() {
           errore("Si è verificato un errore");
       }
     });
   }
  //funzione di supporto che stampa i film e serie tv dalla barra di ricerca
  //PARAMETRO: array di oggetti ritornato dall'api e tipologia di contenuto
  function stampa(arrayOggetti,tipo) {
    var source = $('#tipologia-template').html();
    var template = Handlebars.compile(source);
    var tipologia = {
      "genere" : tipo
    }
    var html = template(tipologia);
    $('#objects').append(html);
    if (arrayOggetti.length === 0) {
      errore("la ricerca non ha prodotto risultati nella sezione" + tipo);
    }else {
      var source = $('#lista-template').html();
      var template = Handlebars.compile(source);
      for (var i = 0; i < arrayOggetti.length; i++) {
        //trasfotmo prima il voto per visualizzare stelle
        var voto = trasformaVoto(arrayOggetti[i].vote_average);
        //trasformo lingua con bandiera corrispondente
        bandiera = trasformaLingua(arrayOggetti[i].original_language);
        var titolo;
        var titolo_originale;
        if (tipo === "Film") {
          titolo = arrayOggetti[i].title;
          titolo_originale = arrayOggetti[i].original_title
        }else if (tipo === "Serie TV") {
          titolo = arrayOggetti[i].name;
          titolo_originale = arrayOggetti[i].original_name
        }
        var context = {
          "copertina" : stampaCopertina(arrayOggetti[i].poster_path),
          "title" : titolo,
          "original_title" : titolo_originale,
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
