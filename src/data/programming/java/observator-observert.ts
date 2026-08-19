import type { ProgrammingLesson } from "../../../types/programming";

export const javaObserverPattern: ProgrammingLesson = {
  id: "observator-observert",
  title: "Observatør-observert-mønsteret",

  sections: [
    {
      title: "Hva er observatør-observert-mønsteret?",
      content:
        "Observatør-observert-mønsteret brukes når ett eller flere objekter skal få beskjed automatisk når et annet objekt endrer tilstand eller når en bestemt hendelse skjer.",
    },
    {
      title: "De to hovedrollene",
      content:
        "Mønsteret har to hovedroller: den observerte og observatøren. Den observerte er objektet som kan endre seg, mens observatøren ønsker å bli varslet når endringen skjer.",
      code: `Observert
   |
   +--> Observatør A
   +--> Observatør B
   +--> Observatør C`,
      tip: "Tenk: ett objekt publiserer endringer, andre objekter abonnerer på dem.",
    },
    {
      title: "Hvorfor trenger vi mønsteret?",
      content:
        "I større programmer må ofte flere objekter reagere når ett objekt endrer seg. Vi ønsker å gjøre dette uten at objektene blir unødvendig tett koblet sammen.",
    },
    {
      title: "Polling vs varsling",
      content:
        "Uten observer-mønsteret kunne en observatør stadig spurt det andre objektet om noe har endret seg. Dette kalles polling. Observer-mønsteret snur dette: den observerte sender beskjed når endringen faktisk skjer.",
      code: `Polling:
Observer -> "Har du endret deg?"
Observer -> "Har du endret deg?"
Observer -> "Har du endret deg?"

Observer:
Subject -> "Jeg har endret meg!"`,
      tip: "Varsling er ofte både tydeligere og mer effektivt enn kontinuerlig polling.",
    },
    {
      title: "En enkel problemstilling",
      content:
        "Anta at et Idol har en hårfarge, og en Beundrer ønsker å reagere hver gang hårfargen endres.",
      code: `Idol
  hairColor

Beundrer
  ønsker beskjed
  når hairColor endres`,
    },
    {
      title: "En tett koblet løsning",
      content:
        "Den enkleste løsningen er at Idol kjenner direkte til én bestemt Beundrer og kaller den når hårfargen endres.",
      code: `public class Idol {
  private Color hairColor =
      Color.BLONDE;

  private Beundrer beundrer =
      new Beundrer();

  public void setHairColor(
      Color hairColor
  ) {
    this.hairColor = hairColor;

    beundrer.hairColorChanged(
      hairColor
    );
  }
}`,
      warning: "Idol er nå tett koblet til den konkrete Beundrer-klassen.",
    },
    {
      title: "Hvorfor er tett kobling et problem?",
      content:
        "Hvis Idol selv oppretter Beundrer, blir det vanskelig å bytte observatør, ha flere typer observatører eller bruke Idol uten akkurat denne Beundrer-klassen.",
    },
    {
      title: "La observatøren registreres utenfra",
      content: "En bedre løsning er at observatøren kobles til Idol utenfra.",
      code: `public class Idol {
  private Beundrer beundrer;

  public void addBeundrer(
      Beundrer beundrer
  ) {
    this.beundrer = beundrer;
  }
}`,
      note: "Idol oppretter ikke lenger Beundrer selv.",
    },
    {
      title: "Varsle observatøren",
      content: "Når hårfargen endres, kan Idol kalle en egen notify-metode.",
      code: `public void setHairColor(
    Color hairColor
) {
  this.hairColor = hairColor;

  notifyBeundrer();
}

private void notifyBeundrer() {
  if (beundrer != null) {
    beundrer.hairColorChanged(
      hairColor
    );
  }
}`,
    },
    {
      title: "Registrere og fjerne observatør",
      content:
        "Den observerte tilbyr vanligvis metoder for å legge til og fjerne observatører.",
      code: `public void addBeundrer(
    Beundrer beundrer
) {
  this.beundrer = beundrer;
}

public void removeBeundrer() {
  this.beundrer = null;
}`,
    },
    {
      title: "Flere observatører",
      content:
        "Observer-mønsteret blir virkelig nyttig når flere objekter skal varsles om samme endring.",
      code: `private List<Beundrer> beundrere =
    new ArrayList<>();`,
      note: "Den observerte holder da typisk en Collection med registrerte observatører.",
    },
    {
      title: "Legge til flere observatører",
      content: "Observatører kan registreres i listen.",
      code: `public void addBeundrer(
    Beundrer beundrer
) {
  if (!beundrere.contains(beundrer)) {
    beundrere.add(beundrer);
  }
}`,
      tip: "Det kan være lurt å hindre duplikate registreringer.",
    },
    {
      title: "Fjerne en observatør",
      content: "Observatører bør også kunne slutte å abonnere på endringer.",
      code: `public void removeBeundrer(
    Beundrer beundrer
) {
  beundrere.remove(beundrer);
}`,
    },
    {
      title: "Varsle alle observatørene",
      content:
        "Når tilstanden endres, går den observerte gjennom alle registrerte observatører og sender beskjed.",
      code: `private void notifyBeundrere() {
  for (Beundrer beundrer : beundrere) {
    beundrer.hairColorChanged(
      hairColor
    );
  }
}`,
      note: "Dette er kjernen i observer-mønsteret.",
    },
    {
      title: "Problemet med konkret observatørtype",
      content:
        "Hvis listen har typen List<Beundrer>, kan bare Beundrer-objekter registreres. Vi ønsker ofte at mange forskjellige typer objekter skal kunne observere.",
    },
    {
      title: "Bruk et interface for observatører",
      content:
        "Ved å definere et listener-interface kan den observerte forholde seg til en kontrakt i stedet for én bestemt klasse.",
      code: `public interface BeundrerListener {
  void hairColorChanged(
    Color newHairColor
  );
}`,
      tip: "Dette gir mye løsere kobling.",
    },
    {
      title: "Den observerte bruker interface-typen",
      content:
        "Idol trenger nå bare å vite at observatørene følger BeundrerListener-kontrakten.",
      code: `private List<BeundrerListener>
    listeners =
      new ArrayList<>();`,
    },
    {
      title: "Registrere listener",
      content: "Registreringsmetodene bruker også interface-typen.",
      code: `public void addListener(
    BeundrerListener listener
) {
  listeners.add(listener);
}

public void removeListener(
    BeundrerListener listener
) {
  listeners.remove(listener);
}`,
    },
    {
      title: "Varsle gjennom interfacet",
      content:
        "Den observerte trenger ikke vite hvilken konkret klasse observatøren har.",
      code: `private void notifyListeners() {
  for (
    BeundrerListener listener
        : listeners
  ) {
    listener.hairColorChanged(
      hairColor
    );
  }
}`,
      note: "Polymorfisme gjør at forskjellige implementasjoner kan reagere forskjellig.",
    },
    {
      title: "Forskjellige observatørtyper",
      content:
        "Flere klasser kan implementere samme listener-interface og håndtere endringen på forskjellige måter.",
      code: `public class Beundrer
    implements BeundrerListener {

  @Override
  public void hairColorChanged(
      Color newColor
  ) {
    // Kopier hårfargen
  }
}

public class Logger
    implements BeundrerListener {

  @Override
  public void hairColorChanged(
      Color newColor
  ) {
    System.out.println(
      "Ny farge: " + newColor
    );
  }
}`,
    },
    {
      title: "Samme hendelse, ulike reaksjoner",
      content:
        "Den observerte sender bare beskjed om at noe har skjedd. Hver observatør bestemmer selv hva den gjør med informasjonen.",
      code: `Idol endrer hårfarge

-> Beundrer kopierer fargen
-> Logger skriver logg
-> UI oppdaterer visningen`,
      tip: "Dette er en viktig del av den løse koblingen.",
    },
    {
      title: "Push-modellen",
      content:
        "Den observerte kan sende den nye informasjonen direkte til observatøren i varselet.",
      code: `void hairColorChanged(
  Color newHairColor
);`,
      note: "Dette kalles ofte en push-lignende modell fordi informasjonen sendes med hendelsen.",
    },
    {
      title: "Pull-modellen",
      content:
        "Et alternativ er at observatøren får vite hvilket objekt som endret seg og deretter selv henter informasjonen den trenger.",
      code: `void idolChanged(Idol idol);

// Observatøren kan så bruke:
idol.getHairColor();`,
      note: "Begge variantene brukes i observer-lignende systemer.",
    },
    {
      title: "Flere egenskaper",
      content:
        "Hvis observatørene skal varsles om flere typer endringer, kan listener-interfacet ha flere metoder.",
      code: `public interface IdolListener {
  void hairColorChanged(
    Color newColor
  );

  void outfitChanged(
    Outfit newOutfit
  );
}`,
      note: "Dette gir en tydelig kontrakt for hver type hendelse.",
    },
    {
      title: "Én generell endringsmetode",
      content:
        "Et alternativ er å bruke én generell metode og sende informasjon om hvilken property som endret seg.",
      code: `public interface IdolListener {
  void idolChanged(
    String property,
    Object newValue
  );
}`,
      note: "Dette er mer fleksibelt, men gir mindre typesikker og mindre eksplisitt kode.",
    },
    {
      title: "Tydelig eller fleksibelt?",
      content:
        "Separate listener-metoder gir vanligvis tydeligere kontrakter. En generell event-metode kan være nyttig når det finnes svært mange mulige hendelser.",
    },
    {
      title: "Et mer generelt observer-eksempel",
      content:
        "Her bruker vi TemperatureSensor og TemperatureListener for å vise mønsteret uten Idol-eksempelet.",
      code: `public interface TemperatureListener {
  void temperatureChanged(
    double newTemperature
  );
}`,
    },
    {
      title: "Den observerte sensoren",
      content:
        "TemperatureSensor holder tilstanden og listen med observatører.",
      code: `public class TemperatureSensor {
  private double temperature;

  private List<TemperatureListener>
      listeners =
        new ArrayList<>();

  public void addListener(
      TemperatureListener listener
  ) {
    listeners.add(listener);
  }

  public void removeListener(
      TemperatureListener listener
  ) {
    listeners.remove(listener);
  }
}`,
    },
    {
      title: "Endre tilstand og varsle",
      content:
        "Når temperaturen endres, oppdateres feltet først og observatørene varsles deretter.",
      code: `public void setTemperature(
    double temperature
) {
  this.temperature = temperature;

  notifyListeners();
}

private void notifyListeners() {
  for (
    TemperatureListener listener
        : listeners
  ) {
    listener.temperatureChanged(
      temperature
    );
  }
}`,
      tip: "Vanlig rekkefølge er: endre tilstand -> varsle observatører.",
    },
    {
      title: "En observatør",
      content:
        "Display kan implementere listener-interfacet og oppdatere visningen når temperaturen endres.",
      code: `public class Display
    implements TemperatureListener {

  @Override
  public void temperatureChanged(
      double newTemperature
  ) {
    System.out.println(
      "Temperatur: "
        + newTemperature
    );
  }
}`,
    },
    {
      title: "Koble objektene sammen",
      content: "Observatøren må registreres før den får varsler.",
      code: `TemperatureSensor sensor =
    new TemperatureSensor();

Display display =
    new Display();

sensor.addListener(display);

sensor.setTemperature(21.5);`,
      output: `Temperatur: 21.5`,
    },
    {
      title: "Følg kallet steg for steg",
      content:
        "Når setTemperature(21.5) kalles, endres først sensorens tilstand. Deretter går notifyListeners() gjennom listener-listen. Display.temperatureChanged(21.5) kalles, og Display reagerer.",
      tip: "Når observer-kode virker komplisert, følg ett event gjennom systemet fra start til slutt.",
    },
    {
      title: "Observatører kan være aktive",
      content:
        "En observatør trenger ikke bare passivt vise informasjon. Den kan reagere ved å kalle metoder og påvirke resten av systemet.",
      note: "Det viktige er at reaksjonen starter fordi et varsel mottas.",
    },
    {
      title: "Løs kobling",
      content:
        "TemperatureSensor kjenner bare TemperatureListener-interfacet. Den trenger ikke vite om observatøren er Display, Logger, Alarm eller noe annet.",
      code: `private List<TemperatureListener>
    listeners;`,
      tip: "Dette er grunnen til at interfaces passer svært godt sammen med observer-mønsteret.",
    },
    {
      title: "Open/closed-tankegang",
      content:
        "Nye observatørtyper kan legges til uten at den observerte klassen må endres.",
      code: `Display implements TemperatureListener
Logger implements TemperatureListener
Alarm implements TemperatureListener`,
      note: "TemperatureSensor bruker fortsatt bare samme listener-interface.",
    },
    {
      title: "Observer og collections",
      content:
        "Collection Framework brukes ofte direkte i mønsteret fordi den observerte må holde en samling av observatører.",
      code: `private final List<Listener>
    listeners =
      new ArrayList<>();`,
    },
    {
      title: "Observer og for-each",
      content:
        "Varslingen er ofte bare en for-each-løkke over registrerte observatører.",
      code: `for (Listener listener : listeners) {
  listener.changed(...);
}`,
    },
    {
      title: "Observer og lambda",
      content:
        "Hvis listener-interfacet er funksjonelt, kan en observatør noen ganger registreres direkte som en lambda.",
      code: `sensor.addListener(
  temperature ->
    System.out.println(
      temperature
    )
);`,
      note: "Dette bygger direkte på funksjonelle interfaces og lambda.",
    },
    {
      title: "Listener er et vanlig Java-navn",
      content: "I Java brukes ordet Listener svært ofte for observatørrollen.",
      code: `ActionListener
ChangeListener
PropertyChangeListener
MouseListener`,
      tip: "Når du ser addSomethingListener(), er det svært ofte observer-tankegangen som brukes.",
    },
    {
      title: "Events",
      content:
        "I mange observer-implementasjoner sendes et event-objekt til listeneren. Eventet inneholder informasjon om hva som skjedde.",
      code: `void changed(ChangeEvent event);`,
      note: "Dette gjør det mulig å sende mer informasjon enn bare én enkel verdi.",
    },
    {
      title: "Event source",
      content:
        "Et event-objekt kan også inneholde informasjon om hvilket objekt som utløste hendelsen.",
      code: `event.getSource();`,
      note: "Dette er vanlig i event-baserte Java-API-er.",
    },
    {
      title: "PropertyChangeListener",
      content:
        "Java har blant annet PropertyChangeListener i java.beans. Dette er en ferdig listener-type for endringer i properties.",
      code: `void propertyChange(
  PropertyChangeEvent event
);`,
      note: "TDT4100 markerer denne konkrete API-en som ikke pensum, men den illustrerer observer-mønsteret godt.",
    },
    {
      title: "PropertyChangeEvent",
      content:
        "Et PropertyChangeEvent kan inneholde navnet på egenskapen, gammel verdi og ny verdi.",
      code: `event.getPropertyName();
event.getOldValue();
event.getNewValue();`,
    },
    {
      title: "PropertyChangeSupport",
      content:
        "PropertyChangeSupport kan hjelpe den observerte med å holde styr på listeners og sende varsler.",
      code: `private final PropertyChangeSupport
    support =
      new PropertyChangeSupport(this);`,
      note: "Dette automatiserer mye av add/remove/notify-logikken.",
    },
    {
      title: "Eldre Observable og Observer",
      content:
        "Java hadde tidligere java.util.Observable og java.util.Observer som innebygd støtte for mønsteret.",
      warning:
        "Disse er utdaterte. Moderne kode bruker vanligvis andre listener-løsninger eller egne interfaces.",
    },
    {
      title: "Observer i JavaFX",
      content:
        "JavaFX bruker listener- og property-konsepter svært mye. Derfor vil observer-tankegangen dukke opp igjen når du jobber med GUI og properties.",
      code: `textField.textProperty()
  .addListener(...);`,
      tip: "Når en verdi endres og en listener automatisk kjøres, ser du observer-mønsteret i praksis.",
    },
    {
      title: "Events i JavaFX",
      content:
        "Også event handlers følger en lignende idé: kode registreres for å reagere når en hendelse skjer.",
      code: `button.setOnAction(
  event ->
    System.out.println("Klikket")
);`,
      note: "Dette er ikke nødvendigvis akkurat samme implementasjon som vårt manuelle Observer Pattern, men tankegangen er svært lik.",
    },
    {
      title: "Observer vs delegering",
      content:
        "Delegering og observer handler begge om samarbeid mellom objekter, men løser forskjellige problemer.",
      code: `Delegering:
"Kan du gjøre denne jobben for meg?"

Observer:
"Gi meg beskjed når dette skjer."`,
      tip: "Dette er en veldig nyttig forskjell å huske.",
    },
    {
      title: "Observer vs polling",
      content:
        "Polling betyr at observatøren selv spør gjentatte ganger. Observer betyr at den observerte tar initiativ til å varsle.",
      code: `Polling:
observer -> subject?

Observer:
subject -> observer!`,
    },
    {
      title: "Unngå duplikate listeners",
      content:
        "Hvis samme listener registreres flere ganger, kan den bli varslet flere ganger for én hendelse.",
      code: `public void addListener(
    Listener listener
) {
  if (!listeners.contains(listener)) {
    listeners.add(listener);
  }
}`,
    },
    {
      title: "Fjerne listeners",
      content:
        "Det er viktig å kunne avregistrere observatører når de ikke lenger skal motta varsler.",
      code: `public void removeListener(
    Listener listener
) {
  listeners.remove(listener);
}`,
      note: "Dette kan også være viktig for ressursbruk og objektlivstid i større systemer.",
    },
    {
      title: "Vær forsiktig når listen endres under varsling",
      content:
        "Hvis en listener legger til eller fjerner listeners mens notify-løkken kjører, kan det skape problemer avhengig av implementasjonen.",
      code: `for (Listener listener : listeners) {
  listener.changed();
}`,
      warning:
        "I mer avansert kode må man tenke over om listener-listen kan endres under varslingen.",
    },
    {
      title: "Varsle med kopi av listen",
      content:
        "En enkel teknikk kan være å iterere over en kopi dersom listeners kan endres under varslingen.",
      code: `for (
  Listener listener
      : new ArrayList<>(listeners)
) {
  listener.changed();
}`,
      note: "Dette er et ekstra robusthetsgrep, ikke alltid nødvendig i enkle oppgaver.",
    },
    {
      title: "Feil i én listener",
      content:
        "Hvis én observatør kaster et exception under varsling, kan det stoppe resten av varslingsløkken dersom dette ikke håndteres.",
      note: "Hvordan dette skal håndteres er et designvalg og avhenger av systemet.",
    },
    {
      title: "Ikke overkoble den observerte",
      content:
        "Den observerte bør helst ikke inneholde spesiallogikk for hver konkrete observatørtype.",
      code: `// Dårlig idé:
if (listener instanceof Display) {
  ...
} else if (
  listener instanceof Logger
) {
  ...
}`,
      warning: "Da mister vi mye av poenget med polymorfisme og løs kobling.",
    },
    {
      title: "La observatøren bestemme reaksjonen",
      content:
        "Den observerte sender hendelsen. Observatøren bestemmer hva den betyr for akkurat dette objektet.",
      code: `listener.temperatureChanged(
  temperature
);`,
    },
    {
      title: "Observer og gyldig systemtilstand",
      content:
        "Observer-mønsteret kan brukes når én tilstandsendring krever at andre objekter oppdateres slik at hele systemet forblir konsistent.",
      note: "Dette er koblingen tilbake til gyldig tilstand og objektstrukturer.",
    },
    {
      title: "Observer og objektstrukturer",
      content:
        "Den observerte og observatørene danner en objektstruktur. Forskjellen er at koblingene har en tydelig rolle: registrering og varsling.",
    },
    {
      title: "Observer og innkapsling",
      content:
        "Observatøren trenger ikke få direkte tilgang til den observerte sin interne tilstand. Den kan bare motta informasjon gjennom det definerte listener-grensesnittet.",
      tip: "Dette hjelper systemet med å beholde innkapsling samtidig som objekter samarbeider.",
    },
    {
      title: "Hvordan kjenne igjen mønsteret",
      content:
        "Se etter en klasse som har en collection med listeners/observers, add/remove-metoder og en notify-metode som går gjennom listen.",
      code: `private List<Listener> listeners;

addListener(...)
removeListener(...)
notifyListeners(...)`,
      tip: "Dette er den klassiske observer-strukturen.",
    },
    {
      title: "Hvordan lese observer-kode",
      content:
        "Start med å finne hvem som er observert, hva som utløser varselet, hvilket listener-interface som brukes og hvilke objekter som registrerer seg.",
      code: `1. Hvem eier tilstanden?
2. Hva utløser eventet?
3. Hvem er listener?
4. Hvilken metode kalles?
5. Hva gjør observatøren?`,
    },
    {
      title: "Dette møter du i Java-prosjekter",
      content:
        "Observer-lignende mønstre brukes svært mye i brukergrensesnitt, events, property-systemer og asynkron programmering. Du kommer ofte til å møte metoder som addListener(), setOnAction() eller subscribe(), der kode registreres for å reagere senere.",
    },
    {
      title: "Viktig tankegang",
      content:
        "Den observerte skal ikke trenge å vite hva hver observatør konkret gjør. Den skal bare vite at observatøren følger en bestemt kontrakt. Når noe relevant skjer, varsler den alle registrerte observatører, og hver observatør reagerer på sin egen måte.",
    },
    {
      title: "Dette bør du kunne",
      content:
        "Du bør kunne forklare rollene observert og observatør, implementere et enkelt listener-interface, registrere og fjerne observatører og varsle flere observatører når tilstanden endres. Du bør også forstå hvorfor interfaces og collections er viktige i mønsteret, og forskjellen mellom observer, polling og delegering.",
      tip: "Husk kjeden: observer registrerer seg -> subject endrer tilstand -> subject varsler -> observer reagerer.",
    },
  ],
};
