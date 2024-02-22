//
//  EyeTrack.swift
//
//
//  Created by Yuki Yamato on 2020/10/01.
//

import Foundation
import SwiftUI
import UIKit
import SceneKit
import ARKit
import os

@available(iOS 13.0, *)
public class EyeTrack: ObservableObject {
    private var bufferLookAtPosition: [CGPoint] = []
    @Published public var lookAtPosition: CGPoint = CGPoint(x: 0, y: 0)
    @Published public var lookAtPoint: CGPoint = CGPoint(x: 0, y: 0)
    @Published public var device: Device
    @Published public var face: Face
    @Published public var info: EyeTrackInfo? = nil
    @Published public var isShowRayHint: Bool
    @Published public var ambientIntensity: CGFloat?
  
    enum EyeState {
        case open
        case closed
    }

  
    private var blinkCount = 0
    private var lastEyeState: EyeState = .open
    private let eyeThreshold: CGFloat = 0.7
    private let maxBlinks = 3
  
    private var leScreenX = 0.0;
    private var leScreenY = 0.0;
    private var reScreenX = 0.0;
    private var reScreenY = 0.0;


    private var sceneView: ARSCNView?

    var blinkThreshold: Float
    var smoothingRange: Int
    var updateCallback: (EyeTrackInfo?) -> Void = { _ in }
    var _updateFrame: (CVPixelBuffer?) -> Void = { _ in }

    var logger: Logger = Logger(subsystem: "dev.ukitomato.EyeTrackKit", category: "EyeTrack")

    var onUpdate: (EyeTrackInfo?) -> Void {
        get {
            return self.updateCallback
        }
        set {
            self.updateCallback = newValue
        }
    }

    var onUpdateFrame: (CVPixelBuffer?) -> Void {
        get {
            return self._updateFrame
        }
        set {
            self._updateFrame = newValue
        }
    }

    public init(device: Device, smoothingRange: Int = 1, blinkThreshold: Float = 1.0, isShowRayHint: Bool = false) {
        self.device = device
        self.face = Face(isShowRayHint: isShowRayHint)
        self.smoothingRange = smoothingRange
        self.blinkThreshold = blinkThreshold
        self.isShowRayHint = isShowRayHint
    }

    // SceneViewと紐つける
    public func registerSceneView(sceneView: ARSCNView) {
        self.sceneView = sceneView
        sceneView.scene.rootNode.addChildNode(self.face.node)
        sceneView.scene.rootNode.addChildNode(self.device.node)
    }

    public func showRayHint() {
        logger.debug("show raycast hint")
        self.isShowRayHint = true
        let old_face = self.face.node
        self.face = Face(isShowRayHint: true)
        self.sceneView?.scene.rootNode.replaceChildNode(old_face, with: self.face.node)
    }

    public func hideRayHint() {
        logger.debug("hide raycast hint")
        self.isShowRayHint = false
        let old_face = self.face.node
        self.face = Face(isShowRayHint: false)
        self.sceneView?.scene.rootNode.replaceChildNode(old_face, with: self.face.node)
    }
  
    public func updateLightEstimate(ambientIntensity: CGFloat?) {
         self.ambientIntensity = ambientIntensity
    }
  
    public func getLight() -> CGFloat? {
          return ambientIntensity
    }
  
  public func isBlink() -> CGFloat? {
    return lastEyeState == .open ? 0 : 1   // 0 = Open / 1 = Close
  }
  
  public func getTotalBlinks() -> Int? {
        return blinkCount
  }
  
  public func getEyeXYonScreen() -> [String: CGFloat] {
    return [
    "leftEyeX": self.leScreenX,
    "leftEyeY": self.leScreenY,
    "rightEyeX": self.reScreenX,
    "rightEyeY": self.reScreenY
    ];
  }



    // ARFaceAnchorを基に情報を更新
    public func update(anchor: ARFaceAnchor) {
        // 顔座標更新(眼球座標更新)
        self.face.update(anchor: anchor)
        // 瞬き判定
        if self.face.leftEye.blink > blinkThreshold && lastEyeState == .open {
            logger.debug("Close")
            blinkCount += 1
            lastEyeState = .closed
        } else if self.face.leftEye.blink < blinkThreshold && lastEyeState == .closed {
            lastEyeState = .open
        }
      if self.face.leftEye.blink < blinkThreshold {updateLookAtPosition()}
        
      if let sceneView = self.sceneView { // Replace `yourARSCNViewInstance` with the actual instance of your ARSCNView
        let leftEyeScreenPosition = sceneView.projectPoint(self.face.leftEyePosition)
        self.leScreenX = CGFloat(leftEyeScreenPosition.x)
        self.leScreenY = CGFloat(leftEyeScreenPosition.y)
        let rightEyeScreenPosition = sceneView.projectPoint(self.face.rightEyePosition)
        self.reScreenX = CGFloat(rightEyeScreenPosition.x)
        self.reScreenY = CGFloat(rightEyeScreenPosition.y)
      }

      
        self.info = EyeTrackInfo(face: face, device: device, lookAtPoint: lookAtPoint, isTracked: anchor.isTracked)
        updateCallback(info)
    }

    public func updateFrame(pixelBuffer: CVPixelBuffer) {
        self._updateFrame(pixelBuffer)
    }

    // 視点位置更新
    public func updateLookAtPosition() {
        let rightEyeHittingAt = self.face.rightEye.hittingAt(device: device)
        let leftEyeHittingAt = self.face.leftEye.hittingAt(device: device)
        let lookAt = CGPoint(x: (rightEyeHittingAt.x + leftEyeHittingAt.x) / 2, y: -(rightEyeHittingAt.y + leftEyeHittingAt.y) / 2)
        self.bufferLookAtPosition.append(lookAt)
        self.lookAtPosition = Array(self.bufferLookAtPosition.suffix(smoothingRange)).average!
        self.lookAtPoint = CGPoint(x: self.lookAtPosition.x + self.device.screenPointSize.width / 2, y: self.lookAtPosition.y + self.device.screenPointSize.height / 2)
    }
}
