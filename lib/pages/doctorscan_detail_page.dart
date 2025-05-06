import 'package:flutter/material.dart';
import 'package:oct_system/services/api_service.dart';
import 'package:oct_system/models/scan_model.dart';  // Import your ScanModel

class DoctorScanDetailPage extends StatefulWidget {
  final int scanId;

  const DoctorScanDetailPage({super.key, required this.scanId});

  @override
  _DoctorScanDetailPageState createState() => _DoctorScanDetailPageState();
}

class _DoctorScanDetailPageState extends State<DoctorScanDetailPage> {
  ScanModel? scan;  // Change the type to ScanModel
  bool loading = true;

  @override
  void initState() {
    super.initState();
    _loadScan();
  }

  void _loadScan() async {
    try {
      final result = await ApiService.getScanById(widget.scanId);
      setState(() {
        scan = result;  // Now scan is a ScanModel
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
      appBar: AppBar(title: Text("Doctor Scan Details")),
      body: loading
          ? Center(child: CircularProgressIndicator())
          : scan == null
          ? Center(child: Text("Scan not found"))
          : Padding(
        padding: EdgeInsets.all(16.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Image.network(scan!.imgurl, height: 200),
            SizedBox(height: 16),
            // Text("Classification: ${scan!.classification ?? 'Pending'}"),
            Text("Diagnosis: ${scan!.diagnosis ?? 'Pending'}"),
            Text("Prescription: ${scan!.prescription ?? 'Pending'}"),
            Text("Status: ${scan!.status ?? 'Pending'}"),
          ],
        ),
      ),
    );
  }
}
