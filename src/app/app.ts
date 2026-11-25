import { Component } from '@angular/core';
import { TextEditor } from './components/text-editor/text-editor';

@Component({
  selector: 'app-root',
  imports: [TextEditor],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {

}