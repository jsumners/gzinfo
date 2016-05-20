## Classes

<dl>
<dt><a href="#GZInfo">GZInfo</a></dt>
<dd></dd>
</dl>

## Typedefs

<dl>
<dt><a href="#HeaderInfo">HeaderInfo</a> : <code>object</code></dt>
<dd></dd>
<dt><a href="#FooterInfo">FooterInfo</a> : <code>object</code></dt>
<dd></dd>
</dl>

<a name="GZInfo"></a>

## GZInfo
**Kind**: global class  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| header | <code>[HeaderInfo](#HeaderInfo)</code> | Parsed details from the header. |
| footer | <code>[FooterInfo](#FooterInfo)</code> | Parsed details from the footer. |
| headerBuffer | <code>Buffer</code> | Raw header data. |
| footerBuffer | <code>Buffer</code> | Raw footer data. |
| stats | <code>Stats</code> | Information about the file gleaned from `fs.stat`. |
| crc32 | <code>int</code> | Convenience property for `footer.crc32`. |
| compressedSize | <code>int</code> | Convenience property for `stats.size`. |
| uncompressedSize | <code>int</code> | Convenience property for `footer.uncompressedSize`. |


* [GZInfo](#GZInfo)
    * [new GZInfo(file)](#new_GZInfo_new)
    * _instance_
        * [.isAciiFile()](#GZInfo+isAciiFile) ⇒ <code>boolean</code>
        * [.hasCRC16()](#GZInfo+hasCRC16) ⇒ <code>boolean</code>
        * [.hasExtraFlags()](#GZInfo+hasExtraFlags) ⇒ <code>boolean</code>
        * [.hasOriginalFileName()](#GZInfo+hasOriginalFileName) ⇒ <code>boolean</code>
        * [.hasComment()](#GZInfo+hasComment) ⇒ <code>boolean</code>
        * [.isEncrypted()](#GZInfo+isEncrypted) ⇒ <code>boolean</code>
        * [.hasReservedFlags()](#GZInfo+hasReservedFlags) ⇒ <code>boolean</code>
    * _static_
        * [.FLAGS](#GZInfo.FLAGS) : <code>object</code>
        * [.OS](#GZInfo.OS) : <code>object</code>
        * [.COMPRESSION_METHOD](#GZInfo.COMPRESSION_METHOD) : <code>object</code>

<a name="new_GZInfo_new"></a>

### new GZInfo(file)
Reads information about a gzipped file. Such information includes:

+ level of compression used
+ date when the compression was performed
+ uncompressed size of the data

The information is read *synchronously*.


| Param | Type | Description |
| --- | --- | --- |
| file | <code>string</code> | Path to a gzipped file to read. |

<a name="GZInfo+isAciiFile"></a>

### gzInfo.isAciiFile() ⇒ <code>boolean</code>
Returns whether or not the compressed file is an ASCII file.
According to the [manpage](http://linux.die.net/man/1/gzip),
this is only supported on "some non-Unix systems." Thus, you'll
probably only ever get `false` from this method.

**Kind**: instance method of <code>[GZInfo](#GZInfo)</code>  
<a name="GZInfo+hasCRC16"></a>

### gzInfo.hasCRC16() ⇒ <code>boolean</code>
Returns whether or not the header has a CRC16 value. If present,
this checksum is only for the header. The checksum for the compressed
file is in the footer.

**Kind**: instance method of <code>[GZInfo](#GZInfo)</code>  
<a name="GZInfo+hasExtraFlags"></a>

### gzInfo.hasExtraFlags() ⇒ <code>boolean</code>
Returns whether or not there is an extra header field with additional
information.

**Kind**: instance method of <code>[GZInfo](#GZInfo)</code>  
<a name="GZInfo+hasOriginalFileName"></a>

### gzInfo.hasOriginalFileName() ⇒ <code>boolean</code>
Returns whether or not there is an additional header field that contains
the original name of the compressed file.

**Kind**: instance method of <code>[GZInfo](#GZInfo)</code>  
<a name="GZInfo+hasComment"></a>

### gzInfo.hasComment() ⇒ <code>boolean</code>
Returns whether or not there is an additional header field that contains
a comment about the compressed file.

**Kind**: instance method of <code>[GZInfo](#GZInfo)</code>  
<a name="GZInfo+isEncrypted"></a>

### gzInfo.isEncrypted() ⇒ <code>boolean</code>
Returns whether or not the compressed data is encrypted.

**Kind**: instance method of <code>[GZInfo](#GZInfo)</code>  
<a name="GZInfo+hasReservedFlags"></a>

### gzInfo.hasReservedFlags() ⇒ <code>boolean</code>
Returns whether or not the reserved flags field is set.

**Kind**: instance method of <code>[GZInfo](#GZInfo)</code>  
<a name="GZInfo.FLAGS"></a>

### GZInfo.FLAGS : <code>object</code>
Constants for verifying the `header.flags` bit field.

**Kind**: static property of <code>[GZInfo](#GZInfo)</code>  
<a name="GZInfo.OS"></a>

### GZInfo.OS : <code>object</code>
Constants for verifying the `header.operatingSystem` field.

**Kind**: static property of <code>[GZInfo](#GZInfo)</code>  
<a name="GZInfo.COMPRESSION_METHOD"></a>

### GZInfo.COMPRESSION_METHOD : <code>object</code>
Constants for validating the `header.compressionMethod` field.

**Kind**: static property of <code>[GZInfo](#GZInfo)</code>  
<a name="HeaderInfo"></a>

## HeaderInfo : <code>object</code>
**Kind**: global typedef  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| signature | <code>string</code> | The "magic" bytes of the header in hex format. |
| compressionMethod | <code>int</code> | Value representing the compression method used. |
| flags | <code>int</code> | Bit field indicating various flags set on the file. |
| lastModified | <code>Date</code> | The date and time when the file was compressed. |
| extraFlags | <code>int</code> | Bit field denoting extra information about the file. |
| operatingSystem | <code>int</code> | Indicates the OS used to create the file. |

<a name="FooterInfo"></a>

## FooterInfo : <code>object</code>
**Kind**: global typedef  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| crc32 | <code>int</code> | Checksum value for the compressed data. |
| uncompressedSize | <code>int</code> | The size, in bytes, of the uncompressed data. |

