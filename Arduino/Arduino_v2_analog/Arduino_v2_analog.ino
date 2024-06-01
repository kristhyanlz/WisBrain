#define N_SENSORS 4

byte sensorPin[] = {A1,A2,A3,A4};
int sensorState[] = {0,0,0,0};
char sensorName[] = {'A', 'B', 'C', 'D'};

int led_rojo  = 3;
int led_verde = 2;

int time_delay = 0;

bool state = false;

void setup() {
  // put your setup code here, to run once:
  Serial.begin(9600);

  pinMode(led_rojo, INPUT);
  pinMode(led_verde, INPUT);
  //ANALOG: 0 - 1023
  //204
  
  //for(register int i = 0; i < N_SENSORS;++i)
  //  pinMode(sensorPin[i], INPUT);
  time_delay = millis();
}


void loop() {
  // put your main code here, to run repeatedly:
  int time_now = millis();

  for (register int i = 0; i < N_SENSORS; ++i){
    int actualState = (analogRead(sensorPin[i]) > 512)? 1 : 0;
    if (sensorState[i] != actualState){
      Serial.print(sensorName[i]);
      Serial.println(actualState);

      sensorState[i] = actualState;
    }
  }

  if ((time_now - time_delay) >= 1000){
    time_delay = millis();

    digitalWrite(led_rojo, (state==true)? HIGH : LOW);
    digitalWrite(led_verde, (state==true)? LOW : HIGH);

    state = not state;
  }
  
  delay(1);
}
