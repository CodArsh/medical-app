import Foundation

@objc(EyeTracking) class EyeTracking: NSObject {
  @objc static func requiresMainQueueSetup() -> Bool { return true }
  @objc public func initTracking(
    _ callback: RCTResponseSenderBlock
  ) {
    
    print("Init Tracking Called =>")
    
    DispatchQueue.main.async {
      // Access the current ViewController instance
      guard let rootViewController = UIApplication.shared.keyWindow?.rootViewController else {
        return
      }
      
      print("Init Tracking Called => Found View Controller")
      
      // Check if the rootViewController is an instance of your ViewController
      if let eyeTrackingViewController = rootViewController as? EyeTrackingViewController {
        print("Init Tracking Called => Found View eyeTrackingViewController")
        // Call the function in the ViewController
        eyeTrackingViewController.initEyeTracking()
      }
    }
    callback(["Initiated"])
  }
  @objc public func stopTracking(
    _ callback: RCTResponseSenderBlock
  ) {
    
    print("Stop Tracking Called =>")
    
    DispatchQueue.main.async {
      // Access the current ViewController instance
      guard let rootViewController = UIApplication.shared.keyWindow?.rootViewController else {
        return
      }
      
      print("Stop Tracking Called => Found View Controller")
      
      // Check if the rootViewController is an instance of your ViewController
      if let eyeTrackingViewController = rootViewController as? EyeTrackingViewController {
        print("Init Tracking Called => Found View eyeTrackingViewController")
        // Call the function in the ViewController
        eyeTrackingViewController.stopEyeTracking()
      }
    }
    callback(["Stopped"])
  }
  @objc public func startEyePosition(
    _ callback: RCTResponseSenderBlock
  ) {
    
    print("startEyePosition Called =>")
    
    DispatchQueue.main.async {
      // Access the current ViewController instance
      guard let rootViewController = UIApplication.shared.keyWindow?.rootViewController else {
        return
      }
      
      print("startEyePositio Called => Found View Controller")
      
      // Check if the rootViewController is an instance of your ViewController
      if let eyeTrackingViewController = rootViewController as? EyeTrackingViewController {
        print("startEyePosition Called => Found View eyeTrackingViewController")
        // Call the function in the ViewController
        eyeTrackingViewController.startEyePosition()
      }
    }
    callback(["startEyePosition"])
  }
  @objc public func stopEyePosition(
    _ callback: RCTResponseSenderBlock
  ) {
    
    print("Stop Eye Pos Tracking Called =>")
    
    DispatchQueue.main.async {
      // Access the current ViewController instance
      guard let rootViewController = UIApplication.shared.keyWindow?.rootViewController else {
        return
      }
      
      print("Stop Tracking Called => Found View Controller")
      
      // Check if the rootViewController is an instance of your ViewController
      if let eyeTrackingViewController = rootViewController as? EyeTrackingViewController {
        print("Init Tracking Called => Found View eyeTrackingViewController")
        // Call the function in the ViewController
        eyeTrackingViewController.stopEyePosition()
      }
    }
    callback(["Stopped"])
  }
}
