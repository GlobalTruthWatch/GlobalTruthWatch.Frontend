import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WriterRequest } from '../../../../../models/writer-requests';
import { WriterService } from '../../../../../Services/writer.service';

@Component({
  selector: 'app-writers-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './writers-list.component.html',
  styleUrls: ['./writers-list.component.css']
})
export class WritersListComponent implements OnInit {
  writers: WriterRequest[] = [];
  loading = true;
  error: string | null = null;
  deletingId: number | null = null;

  constructor(private writerService: WriterService) {}

  ngOnInit(): void {
    this.loadWriters();
  }

  loadWriters() {
    this.writerService.getAllWritersList().subscribe({
      next: (data) => {
        this.writers = data;
        this.loading = false;
      },
      error: () => {
        this.error = 'Failed to load writers list';
        this.loading = false;
      }
    });
  }

  // 🗑️ Delete a writer
  deleteWriter(id: number) {
    if (!confirm('Are you sure you want to delete this writer?')) return;

    this.deletingId = id;

    this.writerService.removeWriter(id).subscribe({
      next: (response) => {
        alert(response.message);
        this.writers = this.writers.filter((writer) => writer.id !== id);
        this.deletingId = null;
      },
      error: () => {
        alert('Failed to delete writer');
        this.deletingId = null;
      }
    });
  }
}
