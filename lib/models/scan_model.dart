// lib/models/scan_model.dart

class ScanModel {
  final int id;
  final String imgurl;
  final String classification;
  final String diagnosis;
  final String prescription;
  final String status;
  final String createdAt;

  ScanModel({
    required this.id,
    required this.imgurl,
    required this.classification,
    required this.diagnosis,
    required this.prescription,
    required this.status,
    required this.createdAt,
  });

  factory ScanModel.fromJson(Map<String, dynamic> json) {
    return ScanModel(
      id: json['id'],
      imgurl: json['imgurl'],
      classification: json['classification'] ?? 'Not classified',
      diagnosis: json['diagnosis'] ?? 'Not diagnosed',
      prescription: json['prescription'] ?? 'Not prescribed',
      status: json['status'] ?? 'Pending',
      createdAt: json['createdAt'] ?? '',
    );
  }
}
