export enum WriterType {
  Blogger = 0,
  Journalist = 1
}

export interface WriterRequest {
  id: number;
  name: string;      // ✅ اسم الكاتب
  email: string;     // ✅ ايميل الكاتب
  type: WriterType | null;
  applicationDate: string;
  approvedDate?: string | null;
  user: {
    id: number;
    name: string;
    email?: string | null;
  };

  // للحالة المحلية في الواجهة
  status?: 'pending' | 'accepted' | 'rejected';

  // لتخزين النوع المحدد قبل القبول
  selectedType?: WriterType;
}
