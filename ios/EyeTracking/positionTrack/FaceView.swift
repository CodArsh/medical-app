//
//  FaceRectangle.swift
//  FaceRecognition
//
//  Created by Daniel Radshun on 25/11/2019.
//  Copyright © 2019 Daniel Radshun. All rights reserved.
//

import UIKit
import CoreGraphics

class FaceView: UIView {
    
    var boundingBox = CGRect.zero

//    var rightEye: [CGPoint] = []
//    var leftEye: [CGPoint] = []
    var leftEye: [CGPoint] = [] {
        didSet {
            if !leftEye.isEmpty {
                leftEyeCenter = average(of: leftEye)
            } else {
                leftEyeCenter = nil
            }
        }
    }

    var rightEye: [CGPoint] = [] {
        didSet {
            if !rightEye.isEmpty {
                rightEyeCenter = average(of: rightEye)
            } else {
                rightEyeCenter = nil
            }
        }
    }

    private func average(of points: [CGPoint]) -> CGPoint {
        let sum = points.reduce(CGPoint.zero) { (acc, point) -> CGPoint in
            return CGPoint(x: acc.x + point.x, y: acc.y + point.y)
        }
        return CGPoint(x: sum.x / CGFloat(points.count), y: sum.y / CGFloat(points.count))
    }

    var rightEyebrow: [CGPoint] = []
    var leftEyebrow: [CGPoint] = []
    var faceContour: [CGPoint] = []
    var nose: [CGPoint] = []
    var outerLips: [CGPoint] = []
    var innerLips: [CGPoint] = []
    var leftEyeCenter: CGPoint?
    var rightEyeCenter: CGPoint?
    
    
    override func draw(_ rect: CGRect) {
      super.draw(rect)
        guard let context = UIGraphicsGetCurrentContext() else {
            print("Context not found")
            return
        }
       
        context.saveGState()
//      let eyeRadius: CGFloat = 8.0
//        UIColor.red.setFill()
        
//        if let leftEyeCenter = leftEyeCenter {
//            let leftEyeRect = CGRect(x: leftEyeCenter.x - eyeRadius, y: leftEyeCenter.y - eyeRadius, width: 2 * eyeRadius, height: 2 * eyeRadius)
//            let eyePath = UIBezierPath(ovalIn: leftEyeRect)
//            UIColor.red.setStroke()  // Set stroke color to red
//            eyePath.lineWidth = 3   // Set line width to 3px
//            eyePath.stroke()        // Stroke the path instead of fill
//        }
//        
//        if let rightEyeCenter = rightEyeCenter {
//            let rightEyeRect = CGRect(x: rightEyeCenter.x - eyeRadius, y: rightEyeCenter.y - eyeRadius, width: 2 * eyeRadius, height: 2 * eyeRadius)
//            let eyePath = UIBezierPath(ovalIn: rightEyeRect)
//            UIColor.red.setStroke()  // Set stroke color to red
//            eyePath.lineWidth = 3   // Set line width to 3px
//            eyePath.stroke()        // Stroke the path instead of fill
//        }
        
        //add blue rect around the face
//        context.addRect(boundingBox)
//        UIColor.blue.setStroke()

        context.strokePath()

//        UIColor.green.setStroke()

//        if !rightEye.isEmpty {
////          context.addLines(between: rightEye)
////          context.closePath()
////          context.strokePath()
//        }
//
//        if !leftEye.isEmpty {
////          context.addLines(between: leftEye)
////          context.closePath()
////          context.strokePath()
//        }
//
////        UIColor.white.setStroke()
//
//        if !rightEyebrow.isEmpty {
////          context.addLines(between: rightEyebrow)
////          context.strokePath()
//        }
//
//        if !leftEyebrow.isEmpty {
////          context.addLines(between: leftEyebrow)
////          context.strokePath()
//        }
//
//        if !nose.isEmpty {
////          context.addLines(between: nose)
////          context.strokePath()
//        }
//
//        if !faceContour.isEmpty {
////          context.addLines(between: faceContour)
////          context.strokePath()
//        }
//
////        UIColor.red.setStroke()
//
//        if !outerLips.isEmpty {
////          context.addLines(between: outerLips)
////          context.closePath()
////          context.strokePath()
//        }
//
//        if !innerLips.isEmpty {
////          context.addLines(between: innerLips)
////          context.closePath()
////          context.strokePath()
//        }
        
        //MSApps logo
//        if !leftEyebrow.isEmpty {
//            let point = CGPoint(x: leftEyebrow.first!.x + 20, y: leftEyebrow.first!.y - 40)
////            drawImage(point: point)
//            print("X coordinate of left eyebrow's first point: \(leftEyebrow.first!.x)")
//            print("Y coordinate of left eyebrow's first point: \(leftEyebrow.first!.y)")
//        }
        
        context.restoreGState()
    }
    
    func drawImage(point:CGPoint) {
      print("Draw image called ==>")
//        let mouse = UIImage(named: "ms-c-logo")
//        mouse?.draw(at: point)
    }
    
    func clearDrawings() {
        boundingBox = .zero
        rightEye = []
        leftEye = []
        rightEyebrow = []
        leftEyebrow = []
        faceContour = []
        nose = []
        outerLips = []
        innerLips = []
            
        DispatchQueue.main.async {
            self.setNeedsDisplay()
        }
    }
}
