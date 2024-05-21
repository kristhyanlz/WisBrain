#define N_SENSORS 4

int sensorPin[] = {12,11,10,9};
int sensorState[] = {1,1,1,1};
char sensorName[] = {'A', 'B', 'C', 'D'};

void setup() {
  // put your setup code here, to run once:
  Serial.begin(9600);
  for(register int i = 0; i < N_SENSORS;++i)
    pinMode(sensorPin[i], INPUT);
}

void loop() {
  // put your main code here, to run repeatedly:
  for (register int i = 0; i < N_SENSORS; ++i){
    int actualState = digitalRead(sensorPin[i]);
    if (sensorState[i] != actualState){
      Serial.print(sensorName[i]);
      Serial.println(actualState);

      sensorState[i] = actualState;
    }
  }
  
  delay(1);
}
