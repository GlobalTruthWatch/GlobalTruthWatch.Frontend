import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PublishService } from '../../../Services/Posts-Writer/publish.service';

@Component({
  selector: 'app-publish-create',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './publish-create.component.html',
  styleUrls: ['./publish-create.component.css']
})
export class PublishCreateComponent {
  title = '';
  summary = '';
  content = '';
  category = '';
  language = 'en';
  imageFile: File | null = null;
  loading = false;
  successMessage = '';
  errorMessage = '';

  // Dropdown categories
  categories = [
    'Africa',
    'Americas',
    'Asia',
    'Europe',
    'MiddleEast',
    'Oceania'
  ];

  constructor(private publishService: PublishService) {}

  onFileChange(event: any) {
    if (event.target.files.length > 0) {
      this.imageFile = event.target.files[0];
    }
  }

  submitForm() {
    if (!this.title || !this.summary || !this.content || !this.imageFile || !this.category) {
      this.errorMessage = 'Please fill all required fields, select category, and select an image.';
      return;
    }

    const formData = new FormData();
    formData.append('title', this.title);
    formData.append('summary', this.summary);
    formData.append('content', this.content);
    formData.append('category', this.category); // الاسم بيتبعت
    formData.append('language', this.language);
    formData.append('image', this.imageFile, this.imageFile.name);

    this.loading = true;
    this.errorMessage = '';
    this.successMessage = '';

    this.publishService.createPublish(formData).subscribe({
      next: (res) => {
        this.loading = false;
        this.successMessage = res.message || 'Publish created successfully!';
        this.title = '';
        this.summary = '';
        this.content = '';
        this.category = '';
        this.imageFile = null;
      },
      error: (err) => {
        this.loading = false;
        this.errorMessage = err.error?.message || 'Failed to create publish.';
        console.error(err);
      }
    });
  }
}
