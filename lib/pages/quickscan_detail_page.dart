import 'package:flutter/material.dart';
import 'package:oct_system/services/api_service.dart';
import 'package:oct_system/models/quickscan_model.dart';  // Import QuickScanModel instead

class QuickScanDetailPage extends StatefulWidget {
  final int scanId;

  const QuickScanDetailPage({required this.scanId});

  @override
  _QuickScanDetailPageState createState() => _QuickScanDetailPageState();
}

class _QuickScanDetailPageState extends State<QuickScanDetailPage> {
  QuickScanModel? scan;  // Change to QuickScanModel
  bool loading = true;

  @override
  void initState() {
    super.initState();
    _loadScan();
  }

  void _loadScan() async {
    try {
      final result = await ApiService.getQuickScanById(widget.scanId);  // Use the API to fetch QuickScan
      setState(() {
        scan = result;
        loading = false;
      });
    } catch (e) {
      setState(() {
        loading = false;
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: Text("Quick Scan Details")),
      body: loading
          ? Center(child: CircularProgressIndicator())
          : scan == null
          ? Center(child: Text("Scan not found"))
          : Padding(
        padding: EdgeInsets.all(16.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Image.network(scan!.imgurl, height: 200),  // Using QuickScanModel property
            SizedBox(height: 16),
            Text("Classification: ${scan!.classification ?? 'Classifying...'}"),  // Using QuickScanModel property
          ],
        ),
      ),
    );
  }
}
