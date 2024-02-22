//
//  EyeTrackViewContrller.swift
//  
//
//  Created by Yuki Yamato on 2020/11/03.
//

import UIKit
import SceneKit
import ARKit
import WebKit
import ARVideoKit
import Vision
//import React
//import ReactNative

open class EyeTrackViewController: UIViewController, ARSCNViewDelegate, ARSessionDelegate {

    public var sceneView: ARSCNView!
    public var eyeTrack: EyeTrack!
    public var recorder: RecordAR?
    public var isHidden: Bool?
    var takePic = false;
    
    public func initialize(isHidden: Bool = false, eyeTrack: EyeTrack) {
        print("Eye Tracking Initialize called")
        self.isHidden = isHidden
        self.eyeTrack = eyeTrack
        let frame = super.view.frame

        // Initialize ARSCNView
        self.sceneView = ARSCNView(frame: frame)
        self.view.insertSubview(sceneView!, at: 0)
        // Set the view's delegate
        sceneView.delegate = self
        sceneView.session.delegate = self
        sceneView.isHidden = isHidden
        sceneView.automaticallyUpdatesLighting = true

        // Register EyeTrack module
        self.eyeTrack.registerSceneView(sceneView: sceneView)
        // Setting recorder
        self.recorder = RecordAR(ARSceneKit: sceneView)
      
      let configuration = ARFaceTrackingConfiguration()
      configuration.isLightEstimationEnabled = true

      // Setting recorder
      self.recorder?.prepare(configuration)

      // Run the view's session
      self.sceneView.session.run(configuration, options: [.resetTracking, .removeExistingAnchors])
    }
    
    public func hide() -> Void {
        self.sceneView.isHidden = true
    }

    public func show() -> Void {
        print("Eye Tracking Show called")
        self.sceneView.isHidden = false
    }

    // Start to record SceneView content
    public func startRecord() {
        recorder?.record()
    }

    // Stop to record and Save the recorded video
    public func stopRecord() {
        recorder?.stopAndExport()
      
      /* Code Added by Krunal to completely remove Tracking from the ViewController */
      self.sceneView.session.pause()
      self.sceneView.scene.rootNode.enumerateChildNodes { (node, _) in
          node.removeFromParentNode()
      }
      self.sceneView.removeFromSuperview()
    }

    open override func viewDidLoad() {
        print("Eye Tracking viewDidLoad called")
        super.viewDidLoad()
    }

    open override func viewWillAppear(_ animated: Bool) {
        print("Eye Tracking viewWillAppear called")
        super.viewWillAppear(animated)
        // Create a session configuration
        let configuration = ARFaceTrackingConfiguration()
        configuration.isLightEstimationEnabled = true

        // Setting recorder
        self.recorder?.prepare(configuration)

        // Run the view's session
        self.sceneView.session.run(configuration, options: [.resetTracking, .removeExistingAnchors])
    }

    open override func viewWillDisappear(_ animated: Bool) {
        super.viewWillDisappear(animated)
        // Pause recording
        recorder?.rest()
        // Pause the view's session
        sceneView.session.pause()

    }

    // MARK: - ARSCNViewDelegate


    open func session(_ session: ARSession, didFailWithError error: Error) {
        // Present an error message to the user

    }

    open func sessionWasInterrupted(_ session: ARSession) {
        // Inform the user that the session has been interrupted, for example, by presenting an overlay

    }

    open func sessionInterruptionEnded(_ session: ARSession) {
        // Reset tracking and/or remove existing anchors if consistent tracking is required

    }

    // Update Some View when updating Face Anchor
    open func updateViewWithUpdateAnchor() {
    }
}


extension EyeTrackViewController {
  
  func convert(ciImage: CIImage) -> UIImage? {
      let context = CIContext(options: nil)
      if let cgImage = context.createCGImage(ciImage, from: ciImage.extent) {
          return UIImage(cgImage: cgImage)
      }
      return nil
  }
  
//  func processARFrameForFaceLandmarks(_ frame: ARFrame) {
////    let orient = UIApplication.shared.statusBarOrientation
//    
//    
//    let width = CVPixelBufferGetWidth(frame.capturedImage)
//    let height = CVPixelBufferGetHeight(frame.capturedImage)
//    let transform = frame.displayTransform(
//      for: UIApplication.shared.statusBarOrientation,
//                viewportSize: CGSize(width: height, height: width)
//    ).inverted()
//    let ciImage = CIImage(cvPixelBuffer: frame.capturedImage).transformed(by: transform)
//
//    
////    
////    let viewportSize = sceneView.bounds.size
////    let transform = frame.displayTransform(for: orient, viewportSize: viewportSize).inverted()
////    var ciImage = CIImage(cvPixelBuffer: frame.capturedImage).transformed(by: transform)
//    
////    let ciImage = CIImage(cvPixelBuffer: frame.capturedImage).oriented()
//    if (takePic) {
//      takePic = false;
//      if let uiImage = convert(ciImage: ciImage) {
//          UIImageWriteToSavedPhotosAlbum(uiImage, nil, nil, nil)
//      }
//    }
//      
//      let faceLandmarksRequest = VNDetectFaceLandmarksRequest { (request, error) in
//          if let results = request.results as? [VNFaceObservation] {
//              for face in results {
//                  // Process the landmarks for each face
//                  if let leftEye = face.landmarks?.leftEye {
//                      // Example: Get position of left eye
//                      let eyePosition = self.averagePosition(from: leftEye.normalizedPoints, frameSize: frame.camera.imageResolution)
//                      print("Left eye position:", eyePosition)
//                  }
//              }
//          }
//      }
//      
//    let requestHandler = VNImageRequestHandler(cvPixelBuffer: frame.capturedImage, orientation: .up, options: [:])
//      try? requestHandler.perform([faceLandmarksRequest])
//  }
  
  func averagePosition(from points: [CGPoint], frameSize: CGSize) -> CGPoint {
      var sumX: CGFloat = 0
      var sumY: CGFloat = 0
      for point in points {
          sumX += point.x * frameSize.width
          sumY += point.y * frameSize.height
      }
      let count = CGFloat(points.count)
      return CGPoint(x: sumX / count, y: sumY / count)
  }
  

    public func renderer(_ renderer: SCNSceneRenderer, didAdd node: SCNNode, for anchor: ARAnchor) {
        self.eyeTrack.face.node.transform = node.transform
        guard let faceAnchor = anchor as? ARFaceAnchor else {
            return
        }
        updateAnchor(withFaceAnchor: faceAnchor)
    }

    public func renderer(_ renderer: SCNSceneRenderer, updateAtTime time: TimeInterval) {
        guard let sceneTransformInfo = sceneView.pointOfView?.transform else {
            return
        }
        // Update Virtual Device position
        self.eyeTrack.device.node.transform = sceneTransformInfo
      
        guard let frame = sceneView.session.currentFrame else { return }
//        processARFrameForFaceLandmarks(frame)
    }

    public func renderer(_ renderer: SCNSceneRenderer, didUpdate node: SCNNode, for anchor: ARAnchor) {
        self.eyeTrack.face.node.transform = node.transform
        guard let faceAnchor = anchor as? ARFaceAnchor else {
            return
        }
        updateAnchor(withFaceAnchor: faceAnchor)
    }

    public func updateAnchor(withFaceAnchor anchor: ARFaceAnchor) {
        DispatchQueue.main.async {
            self.eyeTrack.update(anchor: anchor)
        }
    }
  
  public func session(_ session: ARSession, didUpdate frame: ARFrame) {
      let ambientIntensity = frame.lightEstimate?.ambientIntensity
      // Print the ambientIntensity to the debug log
//      print("Ambient Intensity: \(ambientIntensity)")
      self.eyeTrack.updateLightEstimate(ambientIntensity: ambientIntensity)
  }
}
