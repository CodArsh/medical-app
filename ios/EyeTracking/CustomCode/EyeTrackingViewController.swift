//
//  EyeTrackingViewController.swift
//  oculo
//  Created by Krunal Panchal on 07/07/23.
//

import UIKit

@objcMembers class EyeTrackingViewController: EyeTrackViewController, AVCaptureVideoDataOutputSampleBufferDelegate {
//  @IBOutlet weak var faceView: FaceView!
  let faceView = FaceView()
  var eyeTrackController: EyeTrackController!
  
  let dataOutputQueue = DispatchQueue(
  label: "video data queue",
  qos: .userInitiated,
  attributes: [],
  autoreleaseFrequency: .workItem)
  
  //creating session
  var shallTakePic = false
  var videoPreview = AVCaptureVideoPreviewLayer()
  var sequenceHandler = VNSequenceRequestHandler()
  
  let session = AVCaptureSession()
  
  
  override func viewDidLoad() {
    // This is not working.
    print("Eye Tracking: View Did Load")
    super.viewDidLoad()
    
    faceView.frame = view.bounds
    faceView.backgroundColor = .clear
    view.insertSubview(faceView, at: 0)
  }
  
  
  fileprivate func setUpCaptureSession() {
      if let captureDevice = AVCaptureDevice.default(.builtInWideAngleCamera, for: .video, position: .front){
          
          do{
              let input = try AVCaptureDeviceInput(device: captureDevice)
              if session.inputs.isEmpty {
                  session.addInput(input)
              }
          } catch{
              print(error.localizedDescription)
          }
          
          let output = AVCaptureVideoDataOutput()
          if session.outputs.isEmpty {
              session.addOutput(output)
          }
          
          output.setSampleBufferDelegate(self, queue: dataOutputQueue)
          
          output.videoSettings = [kCVPixelBufferPixelFormatTypeKey as String: kCVPixelFormatType_32BGRA]
          
          let videoConnection = output.connection(with: .video)
          videoConnection?.videoOrientation = .portrait
          
          videoPreview = AVCaptureVideoPreviewLayer(session: session)
          videoPreview.frame = UIScreen.main.bounds
          videoPreview.videoGravity = .resizeAspectFill
//        view.layer.addSublayer(videoPreview)
          view.frame = UIScreen.main.bounds
          view.layer.insertSublayer(videoPreview, at: 0)
          
          DispatchQueue.global(qos: .userInitiated).async {
            self.session.startRunning()
          }
      }
  }
  
  func imageBufferToUIImage(_ imageBuffer: CVImageBuffer) -> UIImage? {
      let ciImage = CIImage(cvImageBuffer: imageBuffer)
      let context = CIContext(options: nil)
      guard let cgImage = context.createCGImage(ciImage, from: CGRect(x: 0, y: 0, width: CVPixelBufferGetWidth(imageBuffer), height: CVPixelBufferGetHeight(imageBuffer))) else {
          return nil
      }
      return UIImage(cgImage: cgImage)
  }
  

  @objc func handleDoubleTap () {
    shallTakePic = true;
  }
  
  func captureOutput(_ output: AVCaptureOutput, didOutput sampleBuffer: CMSampleBuffer, from connection: AVCaptureConnection) {

      guard let imageBuffer = CMSampleBufferGetImageBuffer(sampleBuffer) else {
          return
      }
      
      if (shallTakePic) {
        shallTakePic = false;
          if let image = imageBufferToUIImage(imageBuffer) {
              UIImageWriteToSavedPhotosAlbum(image, nil, nil, nil)
          }
      }
      
      let faceDetectionRequest = VNDetectFaceLandmarksRequest(completionHandler: { (request, error) in
          
          if error != nil {
              print("FaceDetection error: \(String(describing: error)).")
          }
          
          guard let faceDetectionRequest = request as? VNDetectFaceLandmarksRequest,
              let results = faceDetectionRequest.results as? [VNFaceObservation] else {
                  return
          }
          DispatchQueue.main.async { [unowned self] in

              if let face = results.first  {
                  self.updateFaceView(for: face)
              }
              else{
                  self.faceView.clearDrawings()
              }
                              
//              self.view.bringSubviewToFront(self.faceView)
          }
          
      })
      
      do {
          try sequenceHandler.perform(
              [faceDetectionRequest],
              on: imageBuffer,
              orientation: .leftMirrored)
      } catch {
          print(error.localizedDescription)
      }

  }
  
  func convertToLayerPoint(rect: CGRect) -> CGRect {
      //start point
      let startPoint = videoPreview.layerPointConverted(fromCaptureDevicePoint: rect.origin)

      //end point
      let endPoint = videoPreview.layerPointConverted(fromCaptureDevicePoint: CGPoint(x: rect.size.width, y: rect.size.height))

      return CGRect(origin: startPoint, size: CGSize(width: endPoint.x, height: endPoint.y))
  }

  func pointsToDrawFrom(points: [CGPoint]?, to boundingBoxRect: CGRect) -> [CGPoint]? {
      guard let points = points else {
          return nil
      }
      
      return points.compactMap { makeDrawableLandmarkOnLayer(point: $0, rect: boundingBoxRect) }
  }
  
  func makeDrawableLandmarkOnLayer(point: CGPoint, rect: CGRect) -> CGPoint{
      //make points from landmark points to something that can be drawn on the current layer

      let drowablePoint = CGPoint(x: point.x * rect.size.width + rect.origin.x, y: point.y * rect.size.height + rect.origin.y)
      
      return videoPreview.layerPointConverted(fromCaptureDevicePoint: drowablePoint)
  }
  
  func updateFaceView(for result: VNFaceObservation) {

      let boundingBox = result.boundingBox
      //convert boundingBox into points in the current layer and setting the FaceView parameter so the draw func will draw a box
      faceView.boundingBox = convertToLayerPoint(rect: boundingBox)

      guard let landmarks = result.landmarks else {
          return
      }
      
//      print("Update Face View")
      if let rightEye = pointsToDrawFrom(points: landmarks.rightEye?.normalizedPoints, to: boundingBox) {
          faceView.rightEye = rightEye
      }

      if let leftEye = pointsToDrawFrom(points: landmarks.leftEye?.normalizedPoints, to: boundingBox) {
            print(leftEye);
          faceView.leftEye = leftEye
      }
      
      if let rightEyebrow = pointsToDrawFrom(points: landmarks.rightEyebrow?.normalizedPoints, to: boundingBox) {
          faceView.rightEyebrow = rightEyebrow
      }

      if let leftEyebrow = pointsToDrawFrom(points: landmarks.leftEyebrow?.normalizedPoints, to: boundingBox) {
          faceView.leftEyebrow = leftEyebrow
      }
      
      if let faceContour = pointsToDrawFrom(points: landmarks.faceContour?.normalizedPoints, to: result.boundingBox) {
          faceView.faceContour = faceContour
      }

      if let nose = pointsToDrawFrom(points: landmarks.nose?.normalizedPoints, to: result.boundingBox) {
          faceView.nose = nose
      }

      if let outerLips = pointsToDrawFrom(points: landmarks.outerLips?.normalizedPoints, to: result.boundingBox) {
          faceView.outerLips = outerLips
      }

      if let innerLips = pointsToDrawFrom(points: landmarks.innerLips?.normalizedPoints, to: result.boundingBox) {
          faceView.innerLips = innerLips
      }
      
      DispatchQueue.main.async {
        self.faceView.setNeedsDisplay()
        
        // Let's pass to JS Event
        var eventData: [String: Any] = [:]

        if let leftEyeCenter = self.faceView.leftEyeCenter {
            eventData["leCenter"] = ["x": leftEyeCenter.x, "y": leftEyeCenter.y]
        } else {
            eventData["leCenter"] = NSNull()
        }

        if let rightEyeCenter = self.faceView.rightEyeCenter {
            eventData["reCenter"] = ["x": rightEyeCenter.x, "y": rightEyeCenter.y]
        } else {
            eventData["reCenter"] = NSNull()
        }

        EyeTrackingEventEmitter.emitter.sendEvent(withName: "tracking_eye_pos", body: eventData)

      }
  }
  
  override func viewWillAppear(_ animated: Bool) {
    print("Eye Tracking: View Will Appear")
    // super.viewWillAppear(animated)
  }
  
  override func viewDidAppear(_ animated: Bool) {
    print("Eye Tracking: View Did Appear")
    super.viewDidAppear(animated)
  }
  
  override func viewWillDisappear(_ animated: Bool) {
    print("Eye Tracking: View Will Disappear")
    super.viewWillDisappear(animated)
  }
  
  public func startEyePosition() {
    self.setUpCaptureSession()
  }
  
  public func stopEyePosition() {
    print("Stop Eye Position ===> ")
    DispatchQueue.global(qos: .userInitiated).async {
      self.session.stopRunning()
      for input in self.session.inputs {
          self.session.removeInput(input)
      }

      for output in self.session.outputs {
          self.session.removeOutput(output)
      }
      print("Stop Eye Position ===> Done ")
    }
    DispatchQueue.main.async {
      self.videoPreview.removeFromSuperlayer()
      print(self.videoPreview.superlayer)
      print("Stop Eye Position ===> Done1 ")
    }
  }
  
  // InitEyeTracking: This function initiates EyeTracking
  public func initEyeTracking() {
    self.eyeTrackController = EyeTrackController(device: Device(type: .iPhone11), smoothingRange: 10, blinkThreshold: 0.7, isHidden: false)
    self.eyeTrackController.onUpdate = { info in
      guard let point = info?.centerEyeLookAtPoint else { return }
      
      // Let's build the Event Data
      let eventData: [String: Any] = [
       "faceRotation": [ "x": info?.faceRotaion.x, "y": info?.faceRotaion.y, "z": info?.faceRotaion.z, "w": info?.faceRotaion.w ],
       "facePosition": [ "x": info?.facePosition.x, "y": info?.facePosition.y, "z": info?.facePosition.z ],
       "deviceRotation": [ "x": info?.deviceRotation.x, "y": info?.deviceRotation.y, "z": info?.deviceRotation.z, "w": info?.deviceRotation.w ],
       "devicePosition": [ "x": info?.devicePosition.x, "y": info?.devicePosition.y, "z": info?.devicePosition.z ],
       "rightEyePosition": [ "x": info?.rightEyePotision.x, "y": info?.rightEyePotision.y, "z": info?.rightEyePotision.z ],
       "leftEyePosition": [ "x": info?.leftEyePotision.x, "y": info?.leftEyePotision.y, "z": info?.leftEyePotision.z ],
       "rightEyeLookAtPosition": [ "x": info?.rightEyeLookAtPosition.x, "y": info?.rightEyeLookAtPosition.y, "z": info?.rightEyeLookAtPosition.z ],
       "leftEyeLookAtPosition": [ "x": info?.leftEyeLookAtPosition.x, "y": info?.leftEyeLookAtPosition.y, "z": info?.leftEyeLookAtPosition.z ],
       "rightEyeLookAtPoint": [ "x": info?.rightEyeLookAtPoint.x, "y": info?.rightEyeLookAtPoint.y ],
       "leftEyeLookAtPoint":[ "x": info?.leftEyeLookAtPoint.x, "y": info?.leftEyeLookAtPoint.y ],
        "centerEyeLookAtPoint":[ "x": info?.centerEyeLookAtPoint.x, "y": info?.centerEyeLookAtPoint.y ],
       "rightEyeBlink": info?.rightEyeBlink,
       "leftEyeBlink": info?.leftEyeBlink,
       "rightEyeDistance": info?.rightEyeDistance,
       "leftEyeDistance": info?.leftEyeDistance,
       "light": self.eyeTrackController.eyeTrack.getLight(),
       "isBlink": self.eyeTrackController.eyeTrack.isBlink(),
       "totalBlinks": self.eyeTrackController.eyeTrack.getTotalBlinks(),
       "eyeXY": self.eyeTrackController.eyeTrack.getEyeXYonScreen()
      ];
      
      // Let's pass the Event Data to Javascript
      EyeTrackingEventEmitter.emitter.sendEvent(withName: "tracking", body: eventData)
    }
    self.initialize(eyeTrack: eyeTrackController.eyeTrack)
  }
  
  // To be implemented Correctly
  public func stopEyeTracking() {
    print("Stop Tracking Stop Record Called")
    self.eyeTrackController.stopRecord()
    self.stopRecord()
  }
}
