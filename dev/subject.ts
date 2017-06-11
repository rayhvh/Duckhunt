interface Subject {
  
  subscribe(o:Observer):void;
  unsubscribe(o:Observer):void;
}