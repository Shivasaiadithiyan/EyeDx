class QuickScanModel {
  final int id;
  final String imgurl;
  final String classification;
  final String createdAt;

  QuickScanModel({
    required this.id,
    required this.imgurl,
    required this.classification,
    required this.createdAt,
  });

  factory QuickScanModel.fromJson(Map<String, dynamic> json) {
    return QuickScanModel(
      id: json['id'] ?? 0,
      imgurl: json['imgurl'] ?? '',
      classification: json['classification'] ?? 'Pending',
      createdAt: json['createdAt'] ?? '',
    );
  }
}
