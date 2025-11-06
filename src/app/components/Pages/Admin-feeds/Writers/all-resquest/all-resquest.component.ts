import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { WriterService } from '../../../../../Services/writer.service';
import { WriterRequest } from '../../../../../models/writer-requests';

@Component({
  selector: 'app-all-resquest',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './all-resquest.component.html',
  styleUrls: ['./all-resquest.component.css']
})
export class AllResquestComponent implements OnInit {
  writers: WriterRequest[] = [];
  loading = false;
  message = '';

  constructor(private writerService: WriterService) {}

  ngOnInit() {
    this.loadWriters();
  }

  // 🔹 Load all writers from API
  loadWriters() {
    this.loading = true;
    this.writerService.getAllWriters().subscribe({
      next: (res: WriterRequest[]) => {
        this.writers = res;
        this.loading = false;
      },
      error: (err) => {
        console.error(err);
        this.message = 'Failed to load writers';
        this.loading = false;
      }
    });
  }

}
