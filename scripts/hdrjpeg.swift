// hdrjpeg: HEIC (with Apple HDR gain map) -> JPEG with ISO gain map, resized to fit.
import Foundation
import CoreImage
import ImageIO

let a = CommandLine.arguments
guard a.count >= 5 else { print("usage: hdrjpeg in.heic out.jpg maxW maxH [quality]"); exit(1) }
let inURL = URL(fileURLWithPath: a[1]), outURL = URL(fileURLWithPath: a[2])
let maxW = Double(a[3])!, maxH = Double(a[4])!
let quality = a.count > 5 ? Double(a[5])! : 0.82

guard let raw = CIImage(contentsOf: inURL) else { print("cannot read \(inURL.path)"); exit(2) }
let exif = (raw.properties[kCGImagePropertyOrientation as String] as? Int32) ?? 1
let base = raw.oriented(forExifOrientation: exif)
let gainRaw = CIImage(contentsOf: inURL, options: [.auxiliaryHDRGainMap: true])
let gain = gainRaw?.oriented(forExifOrientation: exif)
print("exif orientation:", exif)
print("base:", Int(base.extent.width), "x", Int(base.extent.height))
if let g = gain { print("gain map:", Int(g.extent.width), "x", Int(g.extent.height)) } else { print("gain map: none") }

func fit(_ img: CIImage, _ w: Double, _ h: Double) -> CIImage {
	let s = min(w / img.extent.width, h / img.extent.height)
	let scaled = img.transformed(by: CGAffineTransform(scaleX: s, y: s))
	let o = scaled.extent.origin
	return scaled.transformed(by: CGAffineTransform(translationX: -o.x, y: -o.y))
}

let sdr = fit(base, maxW, maxH)
let ctx = CIContext()
let cs = base.colorSpace ?? CGColorSpace(name: CGColorSpace.displayP3)!
var opts: [CIImageRepresentationOption: Any] = [
	CIImageRepresentationOption(rawValue: kCGImageDestinationLossyCompressionQuality as String): quality
]
if let g = gain { opts[.hdrGainMapImage] = fit(g, maxW / 2, maxH / 2) }
try ctx.writeJPEGRepresentation(of: sdr, to: outURL, colorSpace: cs, options: opts)

let check = CIImage(contentsOf: outURL, options: [.auxiliaryHDRGainMap: true])
let size = (try? FileManager.default.attributesOfItem(atPath: outURL.path)[.size] as? Int) ?? 0
print("wrote", outURL.path, "-", size / 1024, "KB; gain map in output:", check != nil)
