import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { FeedSourceService } from '../../../../Services/feed-source.service';

@Component({
  selector: 'app-add-feed-source',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './add-feed-source.component.html',
  styleUrls: ['./add-feed-source.component.css']
})
export class AddFeedSourceComponent {
  form: FormGroup;
  loading = false;

  categories = [
    { value: 0, label: 'Africa' },
    { value: 1, label: 'Americas' },
    { value: 2, label: 'Asia' },
    { value: 3, label: 'Europe' },
    { value: 4, label: 'Middle East' },
    { value: 5, label: 'Oceania' },
    { value: 6, label: 'World' }
  ];

  constructor(
    private fb: FormBuilder,
    private service: FeedSourceService,
    private router: Router
  ) {
    // ✅ تعريف الفورم بدقة
    this.form = this.fb.group({
      category: [0, Validators.required],
      url: ['', [Validators.required, Validators.pattern(/^https?:\/\/.+/)]]
    });
  }

  save() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      alert('⚠️ Please fill in all required fields correctly.');
      return;
    }

    this.loading = true;
    const data = {
      category: Number(this.form.value.category),
      url: this.form.value.url.trim()
    };

    this.service.create(data).subscribe({
      next: (res) => {
        this.loading = false;
        alert('✅ ' + (res.message || 'Source added successfully!'));
        this.router.navigate(['/feed-sources']);
      },
      error: (err) => {
        this.loading = false;
        console.error('❌ Error:', err);
        alert('❌ Failed to add source: ' + (err.error?.message || 'Unknown error'));
      }
    });
  }
}
