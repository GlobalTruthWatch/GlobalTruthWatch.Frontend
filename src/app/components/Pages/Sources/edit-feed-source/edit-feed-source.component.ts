import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { FeedSourceService } from '../../../../Services/feed-source.service';

@Component({
  selector: 'app-edit-feed-source',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './edit-feed-source.component.html',
  styleUrls: ['./edit-feed-source.component.css']
})
export class EditFeedSourceComponent implements OnInit {
  form!: FormGroup;
  id!: number;
  loading = true;
  saving = false;

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
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private service: FeedSourceService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.id = Number(this.route.snapshot.paramMap.get('id'));
    this.form = this.fb.group({
      category: [0, Validators.required],
      url: ['', Validators.required]
    });

    this.loadSource();
  }

  loadSource() {
    this.service.getAll().subscribe({
      next: (res) => {
        const sources = res.content || [];
        const source = sources.find((s: any) => s.id === this.id);
        if (source) {
          this.form.patchValue({
            category: source.category,
            url: source.url
          });
        }
        this.loading = false;
      },
      error: (err) => {
        console.error(err);
        this.loading = false;
      }
    });
  }

  save() {
    if (this.form.invalid) return;
    this.saving = true;

    // ✅ تأكد أن category رقم وليس نص
    const payload = {
      ...this.form.value,
      category: Number(this.form.value.category)
    };

    this.service.update(this.id, payload).subscribe({
      next: () => {
        this.saving = false;
        alert('✅ Source updated successfully!');
        this.router.navigate(['/feed-sources']);
      },
      error: (err) => {
        this.saving = false;
        console.error(err);
        alert('❌ Failed to update source: ' + (err.error?.message || 'Unknown error'));
      }
    });
  }
}
